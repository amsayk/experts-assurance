import Parse from 'parse/node';

import uuid from 'uuid';

import publish from 'backend/kue-mq/publish';

import { formatError, getOrCreateBusiness, genDocKey, deserializeParseObject, serializeParseObject } from 'backend/utils';
import { BusinessType, ActivityType, DocType } from 'data/types';
import { getRefNo } from 'backend/utils';

import * as codes from 'result-codes';

import { Role_MANAGERS, Role_AGENTS, Role_CLIENTS } from 'roles';

import { SIGN_UP } from 'backend/constants';

export default async function addDoc(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const { payload: {
    vehicle,

    // isOpen,

    company,

    manager,
    agent,
    client,

    dateMission,
    date : dateMS,
  } } = request.params;

  const date = new Date(dateMS);
  // const state = isOpen ? 'OPEN' : 'PENDING';
  const state = 'OPEN';

  const ACL = new Parse.ACL();
  ACL.setPublicReadAccess(false);
  ACL.setPublicWriteAccess(false);

  async function getUser(business, _in, role) {
    if (_in && _in.key === 'id') {
      return Parse.User.createWithoutData(_in[_in.key]);
    }

    if (_in && _in.key === 'userData') {
      const { displayName, email } = _in[_in.key];
      // return await new Parse.User().set({
      //   username : uuid.v4(),
      //   password : uuid.v4(),
      //   displayName,
      //   mail: email,
      //   roles: [role],
      //   business,
      // }).save(null, { useMasterKey: true });

      return await new Promise(async (resolve, reject) => {
        try {
          const signUpRequest = {
            now : request.now,
            user : serializeParseObject(request.user),
            params : {
              password : uuid.v4(),
              displayName,
              email : email || `${uuid.v4()}@epsilon.ma`,
              role,
            },
          };
          const { data : user } = await publish('AUTH', SIGN_UP, signUpRequest);
          resolve(deserializeParseObject(user));
        } catch (e) {
          reject(e);
        }
      })
    }

    return null;
  }

  async function add(business) {
    const refNo = await getRefNo(business);
    const key = await genDocKey();

    const props = {
      agent  : (await getUser(business, agent, Role_AGENTS)),
      client : (await getUser(business, client, Role_CLIENTS)),

      vehicle,

      company,

      refNo,

      state,

      business,

      user: request.user,

      dateMission : new Date(dateMission),
      date,

      key,

      [`lastModified_${request.user.id}`] : new Date(request.now),
      lastModified : new Date(request.now),
    };

    const manager = (await getUser(business, manager, Role_MANAGERS));
    if (manager) {
      props.manager = manager;
    }

    return await new DocType()
      .setACL(ACL)
      .set(props)
      .save(null, { useMasterKey: true });
  }

  const business = request.user.get('business');

  try {
    let doc;
    let activities = [
      { type : 'DOCUMENT_CREATED', user: request.user, state, date },
    ];
    let validation = {
      date,
      user: request.user,
    };
    // let validation = isOpen && {
    //   date,
    //   user: request.user,
    // };

    if (business) {
      doc = await add(await business.fetch({ useMasterKey: true }));
    } else {
      doc = await add(await getOrCreateBusiness());
    }

    const objects = activities.map(({ type, date, user, ...metadata }) => {
      return new ActivityType()
        .setACL(ACL)
        .set({
          ns        : 'DOCUMENTS',
          type      : type,
          metadata  : { ...metadata },
          timestamp : date,
          document  : doc,
          user,
          business,
        });
    });

    if (validation) {
      doc.set({
        validation_user : validation.user,
        validation_date : validation.date,
      });

      objects.push(doc);
    }

    await Promise.all(objects.map((o) => o.save(null, { useMasterKey : true })));

    setTimeout(() => {
      // publish to es_index
      const req = {
        user   : serializeParseObject(request.user),
        now    : request.now,
        params : { id: doc.id },
      };
      publish('ES_INDEX', 'onDoc', req);
    }, 0);

    const [ newDoc, newActivities ] = await Promise.all([
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
      .get(doc.id, { useMasterKey : true }),

      // activities
      new Parse.Query(ActivityType)
      .equalTo('document', doc)
      .include([
        'document',
        'user',
      ])
      .find({ useMasterKey : true })
    ]);

    done(null, {
      doc        : serializeParseObject(newDoc),
      activities : newActivities.map(serializeParseObject),
    });

  } catch (e) {
    done(formatError(e));
  }
}

