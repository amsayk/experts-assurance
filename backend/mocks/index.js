import DataLoader from 'dataloader';

import genModel from './utils/models';
import plateNumber from './utils/plateNumber';

import { Role_ADMINISTRATORS, Role_AGENTS, Role_CLIENTS } from 'roles';

import { DocType } from 'data/types';

import docs from './utils/docs.json';

import users from 'data/_User.json';

export const loaders = {
  refNo : new DataLoader(async function (keys) {
    const objects = await new Parse.Query(DocType)
      .containedIn('refNo', keys)
      .find({ useMasterKey: true });

    return keys.map((refNo) => {
      const index = objects.findIndex((object) => object.get('refNo') === refNo);
      return index !== -1 ? objects[index] : new Error(`Doc ${refNo} not found`);
    });
  }),

  usernames : new DataLoader(async function (keys) {
    const objects = await new Parse.Query(Parse.User)
      .containedIn('username', keys)
      .find({ useMasterKey: true });

    return keys.map((username) => {
      const index = objects.findIndex((object) => object.get('username') === username);
      return index !== -1 ? objects[index] : new Error(`User ${username} not found`);
    });
  }),
};

function genCar() {
  return {
    model       : genModel(),
    plateNumber : plateNumber.genPlateNumber(),
  };
}

function genUser(...roles) {
  const type = users.filter((user) => roles.indexOf(user.role) !== -1).map((user) => user.username);
  return type[plateNumber.genRandomNumber(0, type.length - 1)];
}

const VALID_STATUS = ['OPEN', 'PENDING'];

function genRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function genDocs() {
  console.log('start generating docs');
  return docs.map((doc) => {
    const creator = genUser(Role_ADMINISTRATORS, Role_AGENTS);

    let activities = [];
    let validation = null;
    let closure = null;

    if (doc.status === 'PENDING') {
      activities = [
        { type : 'DOCUMENT_CREATED', state: doc.status, date: new Date(doc.date) },
      ];
    } else if (doc.status === 'OPEN') {
      let date = new Date(doc.date);
      const user = genUser(Role_ADMINISTRATORS, Role_AGENTS);

      const state = VALID_STATUS[plateNumber.genRandomNumber(0, VALID_STATUS.length - 1)];

      activities = [
        { type : 'DOCUMENT_CREATED', state, date: new Date(doc.date) },
      ];

      if (state === 'PENDING') {
        date = genRandomDate(
          new Date(doc.date),
          genRandomDate(
            new Date(new Date(doc.date).getTime() + (2 * 24 * 60 * 60 * 1000)),
            new Date(new Date(doc.date).getTime() + (3 * 7 * 24 * 60 * 60 * 1000)),
          ));

        activities.push({
          type : 'DOCUMENT_STATE_CHANGED',
          fromState: state,
          toState: 'OPEN' ,
          date,
          user,
        });

      }

      validation = {
        date,
        user,
      };

    } else {
      const user = genUser(Role_ADMINISTRATORS, Role_AGENTS);
      const date = state === 'CLOSED'
        ? genRandomDate(new Date(doc.date), new Date())
        : genRandomDate(
          new Date(doc.date),
          genRandomDate(
            new Date(new Date(doc.date).getTime() + (1 * 24 * 60 * 60 * 1000)),
            new Date(new Date(doc.date).getTime() + (2 * 7 * 24 * 60 * 60 * 1000)),
          ));

      const state = VALID_STATUS[plateNumber.genRandomNumber(0, VALID_STATUS.length - 1)];

      activities = [
        { type : 'DOCUMENT_CREATED', state, date: new Date(doc.date) },
        { type : 'DOCUMENT_STATE_CHANGED', fromState: state, toState: doc.status, date, user },
      ];

      if (state === 'OPEN') {
        validation = {
          date : new Date(doc.date),
          user : creator,
        };
      }

      closure = {
        date,
        user,
        state: doc.status,
      };
    }

    const retn = Object.assign({}, doc, {
      date       : new Date(doc.date),
      insurer    : genUser(Role_AGENTS, Role_ADMINISTRATORS),
      client     : genUser(Role_CLIENTS),
      user       : creator,
      vehicle    : genCar(),
      activities,
      validation,
      closure,
    });

    console.log('generated doc:', retn.refNo);
    return retn;
  })
}

