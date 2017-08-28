import Parse from 'parse/node';

import uuid from 'uuid';

import publish from 'backend/kue-mq/publish';

import moment from 'moment';

import DataLoader from 'dataloader';

import {
  formatError,
  getOrCreateBusiness,
  genDocKey,
  deserializeParseObject,
  serializeParseObject,
} from 'backend/utils';
import {
  BusinessType,
  ActivityType,
  DocType,
  ImportationType,
  FileType,
} from 'data/types';
import { businessQuery } from 'data/utils';

import fs from 'fs';

import { DOC_ID_KEY, DOC_FOREIGN_KEY } from 'backend/constants';

import * as codes from 'result-codes';

import { Role_MANAGERS, Role_AGENTS, Role_CLIENTS } from 'roles';

import { SIGN_UP } from 'backend/constants';

export default class Importation {
  static async startImportation(request, done) {
    if (!request.user) {
      done(new Error('A user is required.'));
      return;
    }

    const ongoingImportation =
      (await new Parse.Query(ImportationType)
        .matchesQuery('business', businessQuery())
        .doesNotExist('endDate')
        .count()) > 0;

    if (ongoingImportation) {
      done(new Error('An importation is currently active.'));
    } else {
      try {
        const { files, docs } = request.params;

        const ACL = new Parse.ACL();
        ACL.setPublicReadAccess(false);
        ACL.setPublicWriteAccess(false);

        let business = request.user.get('business');

        if (!business) {
          business = await getOrCreateBusiness();
        }

        async function addUploads(importation) {
          const objects = await Promise.all(
            files.map(async ({ name, type, path, size }) => {
              const fileData = await new Promise((resolve, reject) => {
                fs.readFile(path, (err, buf) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(buf.toString('base64'));
                  }
                });
              });

              const fileObj = await new Parse.File(
                name,
                { base64: fileData },
                type,
              ).save(null, { useMasterKey: true });

              const props = {
                importation,
                fileObj,
                user: request.user,
                business,
                name,
                category: 'IMPORTATION',
                type,
                size,
                date: new Date(request.now),
              };

              return new FileType().setACL(ACL).set(props);
            }),
          );

          await Parse.Object.saveAll(objects, { useMasterKey: true });
          objects.forEach(file => importation.addUnique('files', file.id));
          return importation.save(null, { useMasterKey: true });
        }

        const importation = await new ImportationType()
          .setACL(ACL)
          .set({
            business: BusinessType.createWithoutData(business.id),
            user: request.user,
            docs,
            date: new Date(request.now),
            progress: 0,
            total: docs.length,
          })
          .save(null, { useMasterKey: true });

        await addUploads(importation);

        const activity = await new ActivityType()
          .setACL(ACL)
          .set({
            ns: 'DOCUMENTS',
            type: 'IMPORTATION',
            metadata: {},
            timestamp: new Date(request.now),
            now: new Date(request.now),
            user: request.user,
            business: BusinessType.createWithoutData(business.id),
            importation,
          })
          .save(null, { useMasterKey: true });

        const [newActivity] = await Promise.all([
          // activities
          new Parse.Query(ActivityType)
            .include(['user', 'importation'])
            .get(activity.id, { useMasterKey: true }),
        ]);

        done(null, {
          activity: serializeParseObject(newActivity),
        });
      } catch (e) {
        done(formatError(e));
      }
    }
  }

  static async Import(request, done) {
    if (!request.user) {
      done(new Error('A user is required.'));
      return;
    }

    const { id, doc: info } = request.params;

    let importation;

    try {
      importation = await new Parse.Query(ImportationType).get(id, {
        useMasterKey: true,
      });
    } catch (e) {
      done(new Error('Importation not found.'));
      return;
    }

    if (importation.has('endDate')) {
      done(new Error('Importation has ended.'));
      return;
    }

    const {
      progress,

      // Doc info
      id: refNo,
      vehicle,
      company,
      agent,
      client,
      dateMission: dateMissionMS,
      date: dateMS,
      dateValidation: dateValidationMS,
      paymentDate: paymentDateMS,
      police,
      nature,
    } = info;

    if (importation.get('progress') >= progress) {
      // Already processed
      const [newDoc, newActivities] = await Promise.all([
        // new doc
        new Parse.Query(DocType)
          .include([
            'manager',
            'client',
            'agent',
            'user',
            'payment_user',
            'validation_user',
            'closure_user',
          ])
          .equalTo(DOC_ID_KEY, refNo)
          .first({ useMasterKey: true }),

        // activities
        Parse.Query.or
          .apply(Parse.Query, [
            new Parse.Query(ActivityType).equalTo(DOC_FOREIGN_KEY, refNo),
            new Parse.Query(ActivityType).equalTo('importation', importation),
          ])
          .include(['user', 'importation'])
          .find({ useMasterKey: true }),
      ]);

      done(null, {
        doc: serializeParseObject(newDoc),
        activities: newActivities.map(serializeParseObject),
      });
    } else {
      let oldDoc;

      let doc = await new Parse.Query(DocType)
        .equalTo(DOC_ID_KEY, refNo)
        .include(['manager'])
        .first({ useMasterKey: true });

      if (doc) {
        // Delete doc
        try {
          oldDoc = doc.toJSON();

          await Utils.purgeDoc(doc);
        } catch (e) {
          console.error('Purge error', e);
          done(new Error('Error purging doc.'));
          return;
        }
      }

      const date = new Date(dateMS);
      const dateMission = new Date(dateMissionMS);
      const dateValidation = dateValidationMS
        ? new Date(dateValidationMS)
        : null;
      const paymentDate = paymentDateMS ? new Date(paymentDateMS) : null;

      let business = request.user.get('business');

      if (!business) {
        business = await getOrCreateBusiness();
      }

      try {
        doc = await Utils.addDoc(
          importation,
          request,
          business,
          {
            key: doc ? doc.get('key') : null,
            manager: doc ? doc.get('manager') : null,
            refNo,
            vehicle,
            company,
            agent,
            client,
            dateMission,
            date,
            dateValidation,
            paymentDate,
            police,
            nature,
          },
          oldDoc,
        );
      } catch (e) {
        done(new Error('Error adding doc.'));
        return;
      }

      setTimeout(() => {
        Utils.index(request, doc.id);
      }, 0);

      // Update importation progress
      await importation
        .set({
          progress,
        })
        .save(null, { useMasterKey: true });

      const [newDoc, newActivities] = await Promise.all([
        // new doc
        new Parse.Query(DocType)
          .include([
            'manager',
            'client',
            'agent',
            'user',
            'payment_user',
            'validation_user',
            'closure_user',
          ])
          .get(doc.id, { useMasterKey: true }),

        // activities
        Parse.Query.or
          .apply(Parse.Query, [
            new Parse.Query(ActivityType)
              .equalTo(DOC_FOREIGN_KEY, doc.get(DOC_ID_KEY))
              .include(['user']),

            new Parse.Query(ActivityType)
              .equalTo('importation', importation)
              .include(['user', 'importation']),
          ])
          .find({ useMasterKey: true }),
      ]);

      done(null, {
        doc: serializeParseObject(newDoc),
        activities: newActivities.map(serializeParseObject),
      });
    }
  }

  static async finishImportation(request, done) {
    if (!request.user) {
      done(new Error('A user is required.'));
      return;
    }

    const { id, endDate: endDateMS } = request.params;

    let importation = await new Parse.Query(ImportationType).get(id, {
      useMasterKey: true,
    });

    if (!importation) {
      done(new Error('An importation is currently active.'));
    } else if (importation.has('endDate')) {
      done(new Error('Importation has ended.'));
    } else {
      try {
        importation = await importation
          .set({ endDate: new Date(endDateMS) })
          .save(null, { useMasterKey: true });

        const activity = await new Parse.Query(ActivityType)
          .equalTo('importation', importation)
          .include(['importation', 'user'])
          .first({ useMasterKey: true });

        done(null, {
          activity: serializeParseObject(activity),
        });
      } catch (e) {
        done(formatError(e));
      }
    }
  }
}

const Utils = {
  index(request, id) {
    // publish to es_index
    const req = {
      user: serializeParseObject(request.user),
      now: request.now,
      params: { id },
    };
    publish('ES_INDEX', 'onDoc', req);
  },

  purgeDoc(doc) {
    return doc.destroy({ useMasterKey: true });
  },

  async addDoc(
    importation,
    request,
    business,
    {
      key,
      manager,
      refNo,
      vehicle,
      company,
      agent,
      client,
      dateMission,
      date,
      dateValidation,
      paymentDate,
      police,
      nature,
    },
    oldDoc,
  ) {
    try {
      const newKey = key || (await genDocKey());

      const props = {
        importation,
        imported: true,

        agent: await Utils.getUser(request, business, agent, Role_AGENTS),
        client: await Utils.getUser(request, business, client, Role_CLIENTS),

        vehicle,

        company,

        [DOC_ID_KEY]: refNo,

        state: 'OPEN',

        business: BusinessType.createWithoutData(business.id),

        user: request.user,

        dateMission,
        date,

        key: newKey,

        police,
        nature,

        [`lastModified_${request.user.id}`]: new Date(request.now),
        lastModified: new Date(request.now),
      };

      if (oldDoc) {
        props.previous = oldDoc;
      }

      if (manager) {
        props.manager = manager;
      }

      const ACL = new Parse.ACL();
      ACL.setPublicReadAccess(false);
      ACL.setPublicWriteAccess(false);

      const activities = [];

      const doc = new DocType().setACL(ACL).set(props);

      if (dateValidation) {
        doc.set({
          validation_user: request.user,
          validation_date: dateValidation,
        });
      } /* else if (oldDoc) {
      doc.unset('validation_date');
      doc.unset('validation_user');
    } */

      // Keep existing mtRapport
      if (oldDoc && oldDoc.validation_amount) {
        doc.set({
          validation_amount: oldDoc.validation_amount, // keep previous amount
        });
      }

      if (paymentDate) {
        doc.set({
          payment_user: request.user,
          payment_date: paymentDate,
          payment_at: new Date(request.now),
          payment_amount: oldDoc ? oldDoc.payment_amount : 0, // keep previous amount
        });
      } /* else if (oldDoc) {
      doc.unset('payment_date');
      doc.unset('payment_user');
      doc.unset('payment_date');
      doc.unset('payment_amount');
    } */

      if (oldDoc) {
        // Already exists

        // 1. dtValidation changed?
        {
          const oldDTValidation = oldDoc.validation_date
            ? moment.utc(oldDoc.validation_date).startOf('day')
            : null;

          if (oldDTValidation) {
            const newDTValidation = dateValidation
              ? moment.utc(dateValidation).startOf('day')
              : null;

            // Had dtValidation:
            // generate activity if change, deletion if no new.
            if (!oldDTValidation.isSame(newDTValidation)) {
              activities.push({
                type: 'DT_VALIDATION_CHANGED',
                now: new Date(+moment.utc(request.now).add(1, 'seconds')),
                user: request.user,
                date,
                metadata: {
                  deletion: !dateValidation,
                  fromValue: { date: new Date(+oldDTValidation) },
                  toValue: {
                    date: dateValidation,
                  },
                },
              });
            } else {
              // Since no change and there is a previous value, reset user to original.
              doc.set({
                validation_user: oldDoc.validation_user
                  ? oldDoc.validation_user
                  : request.user,
              });
            }
          } else {
            // No old validation date, check if has new
            if (dateValidation) {
              activities.push({
                type: 'DT_VALIDATION_CHANGED',
                now: new Date(+moment.utc(request.now).add(1, 'seconds')),
                user: request.user,
                date,
                metadata: {
                  fromValue: { date: null },
                  toValue: {
                    date: dateValidation,
                  },
                },
              });
            }
          }
        }

        // 2. paymentDate changed?
        {
          const oldPaymentDate = oldDoc.payment_date
            ? moment.utc(oldDoc.payment_date).startOf('day')
            : null;
          const oldPaymentAmount = oldDoc.payment_amount
            ? oldDoc.payment_amount
            : null;

          if (oldPaymentDate || oldPaymentAmount) {
            const newPaymentDate = paymentDate
              ? moment.utc(paymentDate).startOf('day')
              : null;
            const newPaymentAmount = null;

            // Had paymentDate:
            // generate activity if change, deletion if no new.
            if (
              !oldPaymentDate.isSame(newPaymentDate) ||
              oldPaymentAmount !== newPaymentAmount
            ) {
              activities.push({
                type: 'PAYMENT_CHANGED',
                now: new Date(+moment.utc(request.now).add(2, 'seconds')),
                user: request.user,
                date,
                metadata: {
                  deletion:
                    !paymentDate &&
                    (oldDoc.payment_amount === null ||
                      typeof oldDoc.payment_amount === 'undefined'),
                  fromValue: {
                    date: oldPaymentDate ? new Date(+oldPaymentDate) : null,
                    user: oldDoc.payment_user ? oldDoc.payment_user : null,
                    amount: oldPaymentAmount,
                    at: oldDoc.payment_at ? oldDoc.payment_at : null,
                  },
                  toValue: {
                    date: newPaymentDate ? new Date(+newPaymentDate) : null,
                    user: newPaymentDate ? request.user.id : null,
                    amount: newPaymentDate ? oldDoc.payment_amount : null, // Keep old amount, no new means deletion of amount
                    at: newPaymentDate
                      ? new Date(+moment.utc(request.now).add(2, 'seconds'))
                      : null,
                  },
                },
              });
            } else {
              // Since no change and there is a previous value, reset user to original.
              doc.set({
                payment_user: oldDoc.payment_user
                  ? oldDoc.payment_user
                  : request.user,
              });
            }
          } else {
            // No old payment date and no old payment amount, check if has new
            if (paymentDate) {
              activities.push({
                type: 'PAYMENT_CHANGED',
                now: new Date(+moment.utc(request.now).add(2, 'seconds')),
                user: request.user,
                date,
                metadata: {
                  fromValue: {
                    user: null,
                    amount: null,
                    date: null,
                    at: null,
                  },
                  toValue: {
                    date: paymentDate,
                    user: request.user.id,
                    amount: 0,
                    at: new Date(+moment.utc(request.now).add(2, 'seconds')),
                  },
                },
              });
            }

            if (
              oldDoc.payment_amount !== null &&
              typeof oldDoc.payment_amount !== 'undefined'
            ) {
              doc.set({
                payment_amount: oldDoc.payment_amount,
              });
            }
          }
        }

        const oldState = oldDoc.state;

        // open again?
        const openActivity = moment(date)
          .startOf('day')
          .isAfter(moment(oldDoc.date).startOf('day'));
        if (oldState === 'CLOSED' && openActivity) {
          activities.push({
            type: 'DOCUMENT_STATE_CHANGED',
            metadata: {
              fromState: 'CLOSED',
              toState: 'OPEN',
            },
            now: new Date(+moment.utc(request.now).add(5, 'seconds')),
            date: new Date(+moment.utc(date)),
            user: request.user,
          });

          doc.set({
            state: 'OPEN',
          });
        }

        // close?
        if (paymentDate && dateValidation && oldState === 'OPEN') {
          activities.push({
            type: 'DOCUMENT_STATE_CHANGED',
            metadata: {
              fromState: 'OPEN',
              toState: 'CLOSED',
            },
            now: new Date(+moment.utc(request.now).add(5, 'seconds')),
            date: new Date(
              +moment.max(moment.utc(paymentDate), moment.utc(dateValidation)),
            ),
            user: request.user,
          });

          doc.set({
            state: 'CLOSED',
          });
        }
      } else {
        // Does not exit

        // dtValidation?
        if (dateValidation) {
          activities.push({
            type: 'DT_VALIDATION_CHANGED',
            now: new Date(+moment.utc(request.now).add(1, 'seconds')),
            user: request.user,
            date,
            metadata: {
              fromValue: { date: null },
              toValue: {
                date: dateValidation,
              },
            },
          });
        }

        // paymentDate?
        if (paymentDate) {
          activities.push({
            type: 'PAYMENT_CHANGED',
            now: new Date(+moment.utc(request.now).add(2, 'seconds')),
            user: request.user,
            date,
            metadata: {
              fromValue: {
                user: null,
                amount: null,
                date: null,
                at: null,
              },
              toValue: {
                date: paymentDate,
                user: request.user.id,
                amount: 0,
                at: new Date(+moment.utc(request.now).add(2, 'seconds')),
              },
            },
          });
        }

        // open
        activities.push({
          type: 'DOCUMENT_CREATED',
          user: request.user,
          state: 'OPEN',
          date,
          now: new Date(request.now),
        });

        // close?
        if (paymentDate && dateValidation) {
          activities.push({
            type: 'DOCUMENT_STATE_CHANGED',
            metadata: {
              fromState: 'OPEN',
              toState: 'CLOSED',
            },
            now: new Date(+moment.utc(request.now).add(5, 'seconds')),
            date: new Date(
              +moment.max(moment.utc(paymentDate), moment.utc(dateValidation)),
            ),
            user: request.user,
          });

          doc.set({
            state: 'CLOSED',
          });
        }
      }

      const objects = activities.map(({ type, user, date, now, metadata }) => {
        return new ActivityType().setACL(ACL).set({
          ns: 'DOCUMENTS',
          type,
          importation,
          metadata: { ...metadata },
          timestamp: date,
          now,
          [DOC_FOREIGN_KEY]: refNo,
          user,
          business: BusinessType.createWithoutData(business.id),
        });
      });

      objects.push(doc);

      await Promise.all(objects.map(o => o.save(null, { useMasterKey: true })));

      return doc;
    } catch (e) {
      console.error('Error');
      console.error(e);
      throw e;
    }
  },

  async getUser(request, business, _in, role) {
    if (_in && _in.key === 'id') {
      return Parse.User.createWithoutData(_in[_in.key]);
    }

    if (_in && _in.key === 'userData') {
      const { displayName } = _in[_in.key];

      let user;

      try {
        user = await Utils.loaders.displayNames.load(displayName);
      } catch (e) {
        console.error('Find error', e);
        Utils.loaders.displayNames.clear(displayName);
      }

      if (user) {
        return Parse.User.createWithoutData(user.id);
      }

      return await new Promise(async (resolve, reject) => {
        try {
          const signUpRequest = {
            now: request.now,
            user: serializeParseObject(request.user),
            params: {
              password: uuid.v4(),
              displayName,
              email: `${uuid.v4()}@epsilon.ma`,
              mail: null,
              role,
            },
          };
          const { data: user } = await publish('AUTH', SIGN_UP, signUpRequest);
          resolve(deserializeParseObject(user));
        } catch (e) {
          console.error('Signup error', e);
          reject(e);
        }
      });
    }

    return null;
  },

  loaders: {
    displayNames: new DataLoader(
      async function(keys) {
        const objects = await new Parse.Query(Parse.User)
          .matchesQuery('business', businessQuery())
          .containedIn('displayName', keys)
          .find({ useMasterKey: true });

        return keys.map(displayName => {
          const index = objects.findIndex(
            object => object.get('displayName') === displayName,
          );
          return index !== -1
            ? objects[index]
            : new Error(`User ${displayName} not found`);
        });
      },
      {
        batch: false,
      },
    ),
  },
};
