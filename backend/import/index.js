import Parse from 'parse/node';

import nullthrows from 'nullthrows';

const argv = require('yargs').argv;

import config from 'build/config';

import es, { config as esConfig } from 'backend/es';

import { getOrCreateBusiness, REF_NO_KEY } from 'backend/utils';

import { DocType, ActivityType } from 'data/types';

import fs from 'fs';

import createApolloClient from './apollo-client';

import * as loaders from './loaders';

import isEmpty from 'isEmpty';

import MUTATION from './addDoc.mutation.graphql';

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

  function sleep(n) {
    return new Promise(resolve => setTimeout(resolve, n));
  }

  try {
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
          log('Index successfully deleted');
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
          log('Index successfully created');
        } catch (e) {
          log.error(`Error creating index ${config.esIndex}`, e);
          process.exit(1);
        }

        const business = await getOrCreateBusiness();

        await business.set(REF_NO_KEY, 0)
          .save(null, { useMasterKey : true });

        await sleep(250);
        // Delete all users
        {
          const users = await new Parse.Query(Parse.User)
            .notEqualTo('username', 'admin')
            .find({ useMasterKey : true });
          log(`Found ${users.length} users...`);
          await Promise.all(
            users.map((o) => o.destroy({ useMasterKey : true })));
        }

        await sleep(250);
        // Delete all docs
        {
          const docs = await new Parse.Query(DocType).find({ useMasterKey : true });
          log(`Found ${docs.length} docs...`);
          await Promise.all(
            docs.map((o) => o.destroy({ useMasterKey : true })));
        }

        // Delete all activities
        await sleep(250);
        {
          const activities = await new Parse.Query(ActivityType).find({ useMasterKey : true });
          log(`Found ${activities.length} activities...`);
          await Promise.all(
            activities.map((o) => o.destroy({ useMasterKey : true })));
        }
      }

      await reset();
    }

    // Log in
    const user = await Parse.User.logIn('admin', password);

    const apolloClient = createApolloClient(user);

    await docs.reduce((p, data) => {
      return p.then(async () => {
        const payload = {
          dateMission        : new Date(nullthrows(data['DT Mission'])).getTime(),
          date               : new Date(nullthrows(data['DT Sinistre'])).getTime(),

          company            : data['COMPAGNIE'] || null,

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

          // isOpen             : true,
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
            mutation  : MUTATION,
            variables : { payload },
          });

          if (error) {
            throw new Error(error);
          }

          if (!isEmpty(errors)) {
            throw new Error(`Validation errors: ${JSON.stringify(errors)}`);
          }

          log(`Successfully added doc: ${doc.refNo}`);
        } catch (e) {
          log.error(`Error adding doc: ${JSON.stringify(data)}`);
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

