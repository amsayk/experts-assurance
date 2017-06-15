import Parse from 'parse/node';

import nullthrows from 'nullthrows';

import isEmpty from 'isEmpty';

const argv = require('yargs').argv;

import publish from 'backend/kue-mq/publish';

import config from 'build/config';

import { businessQuery } from 'data/utils';

import es, { config as esConfig } from 'backend/es';

import orderBy from 'lodash.orderby';

import moment from 'moment';

import { serializeParseObject } from 'backend/utils';

import { DocType, ActivityType, FileType } from 'data/types';

import fs from 'fs';

import createApolloClient from './apollo-client';

import * as loaders from './loaders';

import ADD from './addDoc.mutation.graphql';
import CLOSE from './closeDoc.mutation.graphql';

const log = require('log')('app:import');

// Json file path
const filePath = argv.json;
const password = argv.password;

if (!filePath || !password) {
  log(`
    Usage:

    bin/import --json FILE_PATH --password PASSWORD [--keep]
  `);

  process.exit(1);
}

fs.readFile(filePath, 'utf8', async function (err, data) {
  if (err) {
    log.error(`Error reading file ${filePath}.`, err);
    process.exit(1);
  }

  let docs;

  try {
    docs = JSON.parse(data);
  } catch (e) {
    log.error('Invalid json');
    process.exit(1);
  }

  docs = orderBy(docs, (doc) => +moment(doc['DT Sinistre']), ['asc']);

  function sleep(n) {
    return new Promise(resolve => setTimeout(resolve, n));
  }

  function getCompany(doc) {
    const ref = doc['Réf'];

    if (isEmpty(ref)) {
      throw new Error('Company is required.');
    }

    const company = ref.substring(0, 3);

    return company;
  }

  try {
    // Log in
    const user = await Parse.User.logIn('admin', password);

    // Reset all data
    if (!argv.keep) {

      async function reset() {
        log('Resetting...')

        try {
          await new Promise((resolve, reject) => {
            es.indices.delete({
              index : config.esIndex,
            }, function (error, response) {
              if (error) {
                reject(error);
              } else {
                resolve(response);
              }
            });
          });
          log(`Index ${config.esIndex} successfully deleted`);
        } catch (e) {
          log.error(`Error deleting index`, e);
        }

        try {
          await new Promise((resolve, reject) => {
            es.indices.create({
              index : config.esIndex,
              body  : {
                ...esConfig,
              },
            }, function (error, response) {
              if (error) {
                reject(error);
              } else {
                resolve(response);
              }
            });
          });
          log(`Index ${config.esIndex} successfully created`);
        } catch (e) {
          log.error(`Error creating index ${config.esIndex}`, e);
          process.exit(1);
        }

        // Delete all docs
        await sleep(250);
        const importedDocs = await new Parse.Query(DocType)
          .matchesQuery('business', businessQuery())
          .equalTo('imported', true)
          .find({ useMasterKey : true });
        log(`Found ${importedDocs.length} imported docs...`);

        // Delete all activities of imported docs
        await sleep(250);
        {
          const activities = await new Parse.Query(ActivityType)
            .containedIn('document', importedDocs)
            .find({ useMasterKey : true });
          log(`Found ${activities.length} activities...`);
          await Promise.all(
            activities.map((o) => o.destroy({ useMasterKey : true })));
        }

        // Delete all files of imported docs
        await sleep(250);
        {
          const files = await new Parse.Query(FileType)
            .containedIn('document', importedDocs)
            .find({ useMasterKey : true });
          log(`Found ${files.length} files...`);
          await Promise.all(
            files.map((o) => o.destroy({ useMasterKey : true })));
        }

        log(`Deleting imported docs...`);
        await Promise.all(
          importedDocs.map((o) => o.destroy({ useMasterKey : true })));

        // Index non-imported docs
        await sleep(250);
        {
          const docs = await new Parse.Query(DocType)
            .matchesQuery('business', businessQuery())
            .equalTo('imported', false)
            .find({ useMasterKey : true });
          log(`Found ${docs.length} remaining docs...indexing.`);
          await Promise.all(
            docs.map((o) => {
              const req = {
                user   : serializeParseObject(user),
                now    : Date.now(),
                params : { id: o.id },
              };
              return publish('ES_INDEX', 'onDoc', req);
            }));
        }

      }

      await reset();
    }

    const apolloClient = createApolloClient(user);

    await docs.reduce((p, data) => {
      return p.then(async () => {
        const payload = {
          dateMission        : +moment(nullthrows(data['DT Mission'])),
          date               : +moment(nullthrows(data['DT Sinistre'])),

          company            : getCompany(data),

          vehicleManufacturer  : nullthrows(data['Véhicule']),
          vehicleModel         : nullthrows(data['Genre']),
          vehiclePlateNumber   : nullthrows(data['N° Immat']),
          vehicleSeries        : data['N° Série'] || null,
          vehicleMileage       : null,
          vehicleDMC           : null,
          vehicleEnergy        : null,
          vehiclePower         : null,

          clientId           : null,
          clientKey          : 'userData',
          clientDisplayName  : nullthrows(data['Assuré OU Tiers']),
          clientEmail        : null,

          agentId            : null,
          agentKey           : 'userData',
          agentDisplayName   : nullthrows(data['Assureur conseil']),
          agentEmail         : null,

          police             : data['N° Sinistre ou N° Police'],
          nature             : data['Nature'],
        };

        try {
          const client = await loaders.displayNames.load(payload.clientDisplayName);
          if (client) {
            payload.clientId = client.id;
            payload.clientKey = 'id';
          }
        } catch (e) {
          loaders.displayNames.clear(payload.clientDisplayName);
        }

        await sleep(300);

        try {
          const agent = await loaders.displayNames.load(payload.agentDisplayName);
          if (agent) {
            payload.agentId = agent.id;
            payload.agentKey = 'id';
          }
        } catch (e) {
          loaders.displayNames.clear(payload.agentDisplayName);
        }

        await sleep(300);

        log(`Adding doc: ${JSON.stringify(payload)}`);

        try {
          const { data: { addDoc: { doc, error, errors } } } = await apolloClient.mutate({
            mutation  : ADD,
            variables : { payload },
          });

          if (error) {
            throw new Error(error);
          }

          if (!isEmpty(errors)) {
            throw new Error(`Validation errors: ${JSON.stringify(errors)}`);
          }

          const dateValidation = data['DT VALIDATION'];
          const paymentDate    = data['PAIEMENT'];

          if (dateValidation && paymentDate) {
            log(`Closing doc: ${doc.refNo}`);
            const { data : { closeDoc : { error } } }  = await apolloClient.mutate({
              mutation  : CLOSE,
              variables : {
                id   : doc.id,
                info : {
                  dateClosure : +moment(dateValidation),
                  paymentDate : +moment(paymentDate),
                  mtRapports  : 0,
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
          log.error(`Error adding doc: ${JSON.stringify(data)}, ${error}`);
          return Promise.reject(e);
        }

        return sleep(700);
      });
    }, Promise.resolve());

    log('Success');
  } catch (e) {
    log.error(e)
  }

  loaders.displayNames.clearAll();
  user.logOut();
});

