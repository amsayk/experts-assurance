import Parse from 'parse/node';

import {
  PURGE_DOC,
  ADD_DOC,
  DELETE_DOC,
  RESTORE_DOC,
  SET_MANAGER,
  SET_STATE,
  CLOSE_DOC,
  CANCEL_DOC,

  // Payments
  SET_PAY,
  DEL_PAY,
  SET_NATURE,
  DEL_NATURE,
  SET_POLICE,
  DEL_POLICE,

  // Validation
  SET_DT_VALIDATION,
  DEL_DT_VALIDATION,
  DEL_MT_RAPPORTS,
  SET_MT_RAPPORTS,

  // Files
  UPLOAD_FILE,
  DELETE_FILE,
  RESTORE_FILE,
} from 'backend/constants';

// import { deserializeParseObject } from 'backend/utils';

// import uploadFile from 'backend/ops/doc/uploadFile';

export class Docs {
  constructor({ user, connector }) {
    this.user = user;
    this.connector = connector;
  }

  searchVehicles(queryString) {
    return this.connector.searchVehicles(queryString);
  }
  vehicleByPlateNumber(plateNumber) {
    return this.connector.vehicleByPlateNumber(plateNumber);
  }

  get(id) {
    return this.connector.get(id);
  }

  getFile(id) {
    return this.connector.getFile(id);
  }

  getDocObservations({ cursor, id }) {
    return this.connector.getDocObservations({ cursor, id, user: this.user });
  }

  getDocFiles(id) {
    return this.connector.getDocFiles(id);
  }

  isDocValid(id) {
    return this.connector.isDocValid(id);
  }
  getInvalidDocs({
    category,
    // durationInDays,
    cursor,
    sortConfig,
    selectionSet,
    now,
  }) {
    return this.connector.getInvalidDocs({
      category,
      // durationInDays,
      cursor,
      sortConfig,
      user: this.user,
      now,
      selectionSet,
    });
  }
  getUnpaidDocs({ durationInDays, cursor, sortConfig, selectionSet, now }) {
    return this.connector.getUnpaidDocs({
      durationInDays,
      cursor,
      sortConfig,
      user: this.user,
      now,
      selectionSet,
    });
  }

  getDocs(
    { queryString, cursor = 0, sortConfig, client, manager, state },
    topLevelFields,
  ) {
    return this.connector.getDocs(
      queryString,
      cursor,
      sortConfig,
      client,
      manager,
      state,
      this.user,
      topLevelFields,
    );
  }

  // searchUsersByRoles(queryString, roles) {
  //   return this.connector.searchUsersByRoles(queryString, roles);
  // }

  esSearchUsersByRoles(queryString, roles) {
    return this.connector.esSearchUsersByRoles(queryString, roles);
  }

  esSearchDocs(queryString, state) {
    return this.connector.esSearchDocs(queryString, state);
  }

  esQueryDocs(query) {
    return this.connector.esQueryDocs(query);
  }

  queryCompanies(q) {
    return this.connector.queryCompanies(q);
  }

  openDashboard(
    durationInDays,
    cursor,
    sortConfig,
    selectionSet,
    validOnly,
    now,
  ) {
    return this.connector.openDashboard(
      durationInDays,
      cursor,
      sortConfig,
      this.user,
      now,
      selectionSet,
      validOnly,
    );
  }
  // closedDashboard(durationInDays, cursor, sortConfig, selectionSet, includeCanceled, now) {
  //   return this.connector.closedDashboard(
  //     durationInDays,
  //     cursor,
  //     sortConfig,
  //     this.user,
  //     now,
  //     selectionSet,
  //     includeCanceled,
  //   );
  // }

  recent() {
    return this.connector.recentDocs(this.user);
  }

  dashboard(selectionSet) {
    return this.connector.dashboard(this.user, selectionSet);
  }

  // Mutations

  purgeDoc(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: PURGE_DOC, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  addDoc(payload, meta) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: ADD_DOC, args: { payload, ...meta } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  delDoc(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DELETE_DOC, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  restoreDoc(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: RESTORE_DOC, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  setManager(id, manager) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_MANAGER, args: { id, manager } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  setState(id, state) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_STATE, args: { id, state } },
      { sessionToken: this.user.getSessionToken() },
    );
  }
  closeDoc(id, info, meta) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: CLOSE_DOC, args: { id, info, meta } },
      { sessionToken: this.user.getSessionToken() },
    );
  }
  cancelDoc(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: CANCEL_DOC, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  // Payments
  setPay(id, info) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_PAY, args: { id, info } },
      { sessionToken: this.user.getSessionToken() },
    );
  }
  delPay(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DEL_PAY, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  // Nature
  setNature(id, info) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_NATURE, args: { id, info } },
      { sessionToken: this.user.getSessionToken() },
    );
  }
  delNature(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DEL_NATURE, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  // Police
  setPolice(id, info) {
    return Parse.Cloud.run(
      'routeOp',
      {
        __operationKey: SET_POLICE,
        args: { id, info },
      },
      { sessionToken: this.user.getSessionToken() },
    );
  }
  delPolice(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DEL_POLICE, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  // Validation
  setDTValidation(id, info) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_DT_VALIDATION, args: { id, info } },
      { sessionToken: this.user.getSessionToken() },
    );
  }
  delDTValidation(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DEL_DT_VALIDATION, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  setMTRapports(id, info) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: SET_MT_RAPPORTS, args: { id, info } },
      { sessionToken: this.user.getSessionToken() },
    );
  }
  delMTRapports(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DEL_MT_RAPPORTS, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  // Files

  uploadFile(payload) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: UPLOAD_FILE, args: { payload } },
      { sessionToken: this.user.getSessionToken() },
    );

    // const request = {
    //   now    : Date.now(),
    //   params : { payload },
    //   user   : this.user,
    // };
    //
    // return new Promise((resolve, reject) => {
    //   uploadFile(request, (err, response) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       const { file, activities } = response;
    //       resolve({
    //         file       : deserializeParseObject(file),
    //         activities : activities.map(deserializeParseObject),
    //       });
    //     }
    //   });
    // });
  }

  delFile(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: DELETE_FILE, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }

  restoreFile(id) {
    return Parse.Cloud.run(
      'routeOp',
      { __operationKey: RESTORE_FILE, args: { id } },
      { sessionToken: this.user.getSessionToken() },
    );
  }
}
