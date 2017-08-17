import Parse from 'parse/node';

import uuid from 'uuid';

import publish from 'backend/kue-mq/publish';

import moment from 'moment';

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
          oldDoc = {
            date: doc.get('date'),
            dateMission: doc.get('dateMission'),
          };

          await Utils.purgeDoc(doc);
        } catch (e) {
          done(new Error('Error purging doc.'));
          return;
        }
      }

      const date = new Date(dateMS);
      const dateMission = new Date(dateMissionMS);
      const dateValidation = new Date(dateValidationMS);
      const paymentDate = new Date(paymentDateMS);

      let business = request.user.get('business');

      if (!business) {
        business = await getOrCreateBusiness();
      }

      try {
        doc = await Utils.addDoc(
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
    const newKey = key || (await genDocKey());

    const props = {
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

    if (manager) {
      props.manager = manager;
    }

    const ACL = new Parse.ACL();
    ACL.setPublicReadAccess(false);
    ACL.setPublicWriteAccess(false);

    let doc = await new DocType()
      .setACL(ACL)
      .set(props)
      .save(null, { useMasterKey: true });

    let openActivity = true;
    let closedActivity = true;

    if (oldDoc) {
      openActivity = !moment(date)
        .startOf('day')
        .isSame(moment(oldDoc.date).startOf('day'));

      closedActivity = !moment(dateMission)
        .startOf('day')
        .isSame(moment(oldDoc.dateMission).startOf('day'));
    }

    let activities = openActivity
      ? [
          {
            type: 'DOCUMENT_CREATED',
            user: request.user,
            state: 'OPEN',
            date,
            now: new Date(request.now),
          },
        ]
      : [];

    if (dateValidation || paymentDate) {
      if (dateValidation) {
        doc.set({
          validation_user: request.user,
          validation_date: dateValidation,
        });
      }

      if (paymentDate) {
        doc.set({
          payment_user: request.user,
          payment_date: paymentDate,
          payment_at: new Date(request.now),
          payment_amount: 0,
        });
      }

      const dateClosureMS = dateValidation || paymentDate;

      if (closedActivity) {
        activities.push({
          type: 'DOCUMENT_STATE_CHANGED',
          metadata: {
            fromState: 'OPEN',
            toState: 'CLOSED',
          },
          now: new Date(+moment(request.now).add(1, 'second')),
          date: new Date(dateClosureMS),
          user: request.user,
        });
      }

      doc.set({
        state: 'CLOSED',
      });
    }

    const objects = activities.map(({ type, user, date, now, metadata }) => {
      return new ActivityType().setACL(ACL).set({
        ns: 'DOCUMENTS',
        type: type,
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
  },

  async getUser(request, business, _in, role) {
    if (_in && _in.key === 'id') {
      return Parse.User.createWithoutData(_in[_in.key]);
    }

    if (_in && _in.key === 'userData') {
      const { displayName } = _in[_in.key];
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
          reject(e);
        }
      });
    }

    return null;
  },
};
