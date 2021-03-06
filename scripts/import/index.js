import Parse from 'parse/node';

import delay from 'delay';

import nullthrows from 'nullthrows';

import isEmpty from 'isEmpty';

import publish from 'backend/kue-mq/publish';

import config from 'build/config';

import { businessQuery } from 'data/utils';

import es, { config as esConfig } from 'backend/es';

import moment from 'moment';

import { serializeParseObject } from 'backend/utils';

import { DocType, ActivityType, FileType } from 'data/types';

import X from 'xlsx';

import fs from 'fs';

import createApolloClient from './apollo-client';

import { DOC_FOREIGN_KEY, DOC_ID_KEY } from 'backend/constants';

import * as loaders from './loaders';

import ADD from './addDoc.mutation.graphql';
import CLOSE from './closeDoc.mutation.graphql';

const argv = require('yargs').argv;

const log = require('log')('app:import');

// Json file path
const filePath = argv.xlsx;
const password = argv.password;

if (!filePath || !password) {
  log(`
    Usage:

    bin/import --xlsx FILE_PATH --password PASSWORD [--keep]
  `);

  process.exit(1);
}

function process_RS(
  stream: ReadStream,
  cb: (err: Error, wb: Workbook) => void,
): void {
  let buffers = [];
  stream.on('error', function(error) {
    cb(error);
  });
  stream.on('data', function(data) {
    buffers.push(data);
  });
  stream.on('end', function() {
    const buffer = Buffer.concat(buffers);
    const workbook = X.read(buffer, { type: 'buffer' });

    function to_json(workbook) {
      const result = [];
      workbook.SheetNames.forEach(function(sheetName) {
        const roa = X.utils.sheet_to_json(workbook.Sheets[sheetName]);
        if (roa.length > 0) {
          roa.forEach(o => o['Réf'] && result.push(cleanDoc(o)));
        }
      });
      return result;

      function cleanDoc(o) {
        return Object.keys(o).reduce(function(memo, key) {
          const newKey = key.trim().split(/\s+/).join(' ');
          memo[newKey] = o[key];
          return memo;
        }, {});
      }
    }

    cb(null, to_json(workbook));
  });
}

const fStream = fs.createReadStream(filePath);

process_RS(fStream, async function(err, docs) {
  if (err) {
    log.error(`Error reading file ${filePath}.`, err);
    process.exit(1);
  }

  function getRef(doc) {
    const key = doc['Réf'];

    if (isEmpty(key)) {
      throw new Error('getRef: key is required.');
    }

    const company = key.substring(0, 3);
    const ref = key.substring(3);

    return { company, ref };
  }

  try {
    // Log in
    const user = await Parse.User.logIn('admin', password);

    // Reset all data
    if (!argv.keep) {
      async function reset() {
        log('Resetting...');

        try {
          await new Promise((resolve, reject) => {
            es.indices.delete(
              {
                index: config.esIndex,
              },
              function(error, response) {
                if (error) {
                  reject(error);
                } else {
                  resolve(response);
                }
              },
            );
          });
          log(`Index ${config.esIndex} successfully deleted`);
        } catch (e) {
          log.error(`Error deleting index`, e);
        }

        try {
          await new Promise((resolve, reject) => {
            es.indices.create(
              {
                index: config.esIndex,
                body: {
                  ...esConfig,
                },
              },
              function(error, response) {
                if (error) {
                  reject(error);
                } else {
                  resolve(response);
                }
              },
            );
          });
          log(`Index ${config.esIndex} successfully created`);
        } catch (e) {
          log.error(`Error creating index ${config.esIndex}`, e);
          process.exit(1);
        }

        // Delete all docs
        await delay(250);
        const importedDocs = await new Parse.Query(DocType)
          .matchesQuery('business', businessQuery())
          .equalTo('imported', true)
          .find({ useMasterKey: true });
        log(`Found ${importedDocs.length} imported docs...`);

        // Delete all activities of imported docs
        await delay(250);
        {
          const activities = await new Parse.Query(ActivityType)
            .containedIn(
              DOC_FOREIGN_KEY,
              importedDocs.map(doc => doc.get(DOC_ID_KEY)),
            )
            .find({ useMasterKey: true });
          log(`Found ${activities.length} activities...`);
          await Promise.all(
            activities.map(o => o.destroy({ useMasterKey: true })),
          );
        }

        // Delete all files of imported docs
        await delay(250);
        {
          const files = await new Parse.Query(FileType)
            .containedIn(
              DOC_FOREIGN_KEY,
              importedDocs.map(doc => doc.get(DOC_ID_KEY)),
            )
            .find({ useMasterKey: true });
          log(`Found ${files.length} files...`);
          await Promise.all(files.map(o => o.destroy({ useMasterKey: true })));
        }

        log(`Deleting imported docs...`);
        await Promise.all(
          importedDocs.map(o => o.destroy({ useMasterKey: true })),
        );

        // Index non-imported docs
        await delay(250);
        {
          const docs = await new Parse.Query(DocType)
            .matchesQuery('business', businessQuery())
            .equalTo('imported', false)
            .find({ useMasterKey: true });
          log(`Found ${docs.length} remaining docs...indexing.`);
          await Promise.all(
            docs.map(o => {
              const req = {
                user: serializeParseObject(user),
                now: Date.now(),
                params: { id: o.id },
              };
              return publish('ES_INDEX', 'onDoc', req);
            }),
          );
        }
      }

      await reset();
    }

    const apolloClient = createApolloClient(user);

    await docs.reduce((p, data) => {
      return p.then(async () => {
        const { ref, company } = getRef(data);

        const payload = {
          dateMission: +moment(nullthrows(data['DT Mission']), 'DD/MM/YY'),
          date: +moment(nullthrows(data['DT Sinistre']), 'DD/MM/YY'),

          company,

          vehicleManufacturer: nullthrows(data['Véhicule']),
          vehicleModel: data['Genre'] || null,
          vehiclePlateNumber: nullthrows(data['N° Immat']),
          vehicleSeries: data['N° Série'] || null,
          vehicleMileage: null,
          vehicleDMC: null,
          vehicleEnergy: null,
          vehiclePower: null,

          clientId: null,
          clientKey: 'userData',
          clientDisplayName: nullthrows(data['Assuré OU Tiers']),
          clientEmail: null,

          agentId: null,
          agentKey: 'userData',
          agentDisplayName: nullthrows(data['Assureur conseil']),
          agentEmail: null,

          police: data['N° Sinistre ou N° Police'],
          nature: data['Nature'],
        };

        try {
          const client = await loaders.displayNames.load(
            payload.clientDisplayName,
          );
          if (client) {
            payload.clientId = client.id;
            payload.clientKey = 'id';
          }
        } catch (e) {
          loaders.displayNames.clear(payload.clientDisplayName);
        }

        await delay(300);

        try {
          const agent = await loaders.displayNames.load(
            payload.agentDisplayName,
          );
          if (agent) {
            payload.agentId = agent.id;
            payload.agentKey = 'id';
          }
        } catch (e) {
          loaders.displayNames.clear(payload.agentDisplayName);
        }

        const meta = {
          ref,
          imported: true,
        };

        await delay(300);

        log(
          `Adding doc: \ndata=${JSON.stringify(payload)}\nmeta=${JSON.stringify(
            meta,
          )}`,
        );

        try {
          const {
            data: { addDoc: { doc, error, errors } },
          } = await apolloClient.mutate({
            mutation: ADD,
            variables: { payload, meta },
          });

          if (error) {
            throw new Error(error);
          }

          if (!isEmpty(errors)) {
            throw new Error(`Validation errors: ${JSON.stringify(errors)}`);
          }

          const dateValidation = data['DT VALIDATION'];
          const paymentDate = data['PAIEMENT'];

          if (dateValidation && paymentDate) {
            log(`Closing doc: ${doc.refNo}`);
            const { data: { closeDoc: { error } } } = await apolloClient.mutate({
              mutation: CLOSE,
              variables: {
                id: doc[DOC_ID_KEY],
                meta: { importing: true },
                info: {
                  dateClosure: +moment(dateValidation, 'DD/MM/YY'),
                  paymentDate: +moment(paymentDate, 'DD/MM/YY'),
                  mtRapports: 0,
                },
              },
            });

            if (error) {
              log.error(`Error closing doc: ${doc.refNo}`);
              throw new Error(error);
            }
          }

          log(`Successfully added doc: ${doc.refNo}`);
        } catch (e) {
          log.error(`Error adding doc: ${JSON.stringify(data)}, ${e}`);
          return Promise.reject(e);
        }

        return delay(700);
      });
    }, Promise.resolve());

    log('Success');
  } catch (e) {
    log.error(e);
  }

  loaders.displayNames.clearAll();
  user.logOut();

  // Exit Success
  process.exit(0);
});
