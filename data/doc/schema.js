import parseGraphqlScalarFields from 'data/parseGraphqlScalarFields';
import parseGraphqlObjectFields from 'data/parseGraphqlObjectFields';

import getMoment from 'getMoment';

import orderBy from 'lodash.orderby';

import delay from 'delay';

import {
  Role_ADMINISTRATORS,
  Role_MANAGERS,
  userHasRoleAll,
  userHasRoleAny,
  userVerified,
} from 'roles';

import async from 'async';

import * as codes from 'result-codes';

import objectAssign from 'object-assign';

import config from 'build/config';

import * as helpers from './helpers';

import { pubsub } from 'data/subscriptions';

import { DOC_ID_KEY } from 'backend/constants';

import graphqlFields from 'graphql-fields';

import getDocValidations from './docValidations';

import payValidations from 'routes/Landing/containers/Case/body/Users/Overview/Payment/PaymentSetter/PaymentForm/validations';
import getClosureValidations from 'routes/Landing/containers/Case/body/Users/Overview/CloseDoc/CloseDocForm/validations';

import validationValidations from 'routes/Landing/containers/Case/body/Users/Overview/DTValidation/DTValidationSetter/DTValidationForm/validations';
import mtRapportsValidations from 'routes/Landing/containers/Case/body/Users/Overview/MTRapports/MTRapportsSetter/MTRapportsForm/validations';

import natureValidations from 'routes/Landing/containers/Case/body/Users/Overview/Nature2/NatureSetter/NatureForm/validations';
import policeValidations from 'routes/Landing/containers/Case/body/Users/Overview/Police2/PoliceSetter/PoliceForm/validations';

import { fromJS } from 'immutable';

import { Topics } from 'backend/constants';

const log = require('log')('app:backend:docs');

export const schema = [
  `

  type Importation {
    id: ID!
    user: User!
    date: Date!
    endDate: Date
    docs: [JSON!]!
    files: [File!]!
    progress: Int!
    total: Int!
  }

  input ImportationPayload {
    date: Date
    files: [FileInput!]!
    docs: [JSON!]!
  }
  type ImportationResponse {
    error: Error
  }

  type ImportResponse {
    error: Error
    doc: Doc
    activities: [Activity!]!
  }

  type Observation {
    id: ID!
    text: String!
    user: User!
    document: Doc!
    date: Date!
  }

  type DocObservationsResponse {
    items: [Observation!]!
    prevCursor: Date
    cursor: Date
  }

  input DocPaymentInfo {
    date   : Date
    amount : Float
  }

  input DocMTRapportsInfo {
    amount : Float
  }

  input DocClosureInfo {
    dateClosure    : Date
    mtRapports     : Float
    # dateValidation : Date
    paymentDate    : Date
    paymentAmount  : Float
  }

  input DocValidationInfo {
    date : Date
  }

  type UploadFileResponse {
    doc: Doc
    file: File
    activities : [Activity!]!
    error: Error
  }

  type DelOrRestoreFileResponse {
    doc: Doc
    file: File
    activities : [Activity!]!
    error: Error
  }

  input FileInput {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

  type File {
    id: ID!
    name: String!
    category: String!
    type: String!
    size: Int!
    url: String!
    date: Date!
    user: User!
    deletion: Deletion
  }

  type RefNo {
    value: Int!
  }

  # Mutations

  enum UserInKey {
    id
    userData
  }

  input AddDocMeta {
    ref: ID
    imported: Boolean!
  }

  input CloseDocMeta {
    importing: Boolean!
  }

  input AddDocPayload {
    vehicleManufacturer : String
    vehicleModel : String
    vehiclePlateNumber : String
    vehicleSeries : String
    vehicleMileage : String
    vehicleDMC : String
    vehicleEnergy : String
    vehiclePower : String

    clientKey : UserInKey
    clientId : String
    clientDisplayName : String
    clientEmail : String

    agentKey : UserInKey
    agentId : String
    agentDisplayName : String
    agentEmail : String

    dateMission: Date
    date: Date

    company: String

    police: String,
    nature: String
  }

  type AddDocResponse {
    doc: Doc
    activities : [Activity!]!
    errors: JSON!
    error: Error
  }

  type DelOrRestoreDocResponse {
    error: Error
    doc: Doc
    activities : [Activity!]!
  }

  type SetOrDelPayResponse {
    error: Error
    doc: Doc
    activities : [Activity!]!
  }

  type SetOrDelNatureResponse {
    error: Error
    doc: Doc
    activities : [Activity!]!
  }

  type SetOrDelPoliceResponse {
    error: Error
    doc: Doc
    activities : [Activity!]!
  }

  type SetOrDelDTValidationResponse {
    error: Error
    doc: Doc
    activities : [Activity!]!
  }

  type SetOrDelMTRapportsResponse {
    error: Error
    doc: Doc
    activities : [Activity!]!
  }

  type SetManagerResponse {
    doc: Doc
    manager: User
    activities : [Activity!]!
    error: Error
  }

  type SetStateResponse {
    doc: Doc
    activities : [Activity!]!
    error: Error
  }

  # Dashboard

  type OpenShape {
    count: Int!
  }
  type ClosedShape {
    count: Int!
  }
  type CanceledShape {
    count: Int!
  }

  type Dashboard {
    open: OpenShape!
    closed: ClosedShape!
    canceled: CanceledShape!
  }

  # Sort
  enum DocsSortKey {
    refNo
    date
    dateMission
    company
  }

  input DocsSortConfig {
    key: DocsSortKey
    direction: SortDirection
  }

  # Queries

  type ESDocValidationState {
    date: Date
    amount: Float
    user: ESUserSource
  }

  type ESDocClosureState {
    date: Date!
    user: ESUserSource!
    state: DocState!
  }

  type ESDocSource {
    id: ID!
    company: String

    refNo: ID!

    state: DocState!
    dateMission: Date!

    paymentInfo: Payment

    vehicle: Vehicle!

    manager: ESUserSource
    client: ESUserSource!
    agent: ESUserSource!
    user: ESUserSource!

    validation: ESDocValidationState
    closure: ESDocClosureState

    date: Date!
    lastModified: Date!

    police: String
    nature: String
  }

  type ESDoc {
    _index: String!
    _type: String!
    _id: String!
    _score: Float!
    highlight: [String!]!
    _source: ESDocSource!
  }

  input UserQuery {
    id: ID
    q: String
  }

  input DateRange {
    from: Date
    to: Date
  }

  input ESSortConfig {
    key: String
    direction: SortDirection
  }

  input ESDocsQueryPayload {
    q: String
    state: DocState

    company: String
    manager: UserQuery
    client: UserQuery
    agent: UserQuery

    vehicleManufacturer: String
    vehicleModel: String

    missionRange: DateRange
    range: DateRange
    # validationRange: DateRange
    closureRange: DateRange

    validator: UserQuery
    closer: UserQuery
    user: UserQuery

    lastModified: Date

    sortConfig: ESSortConfig

    cursor: Int
  }

  type ESDocsQueryResponse {
    took: Int!
    length: Int!
    max_score: Float
    cursor: Int!
    hits: [ESDoc!]!
  }

  type DocsFetchResponse {
    cursor: Int!
    length: Int!
    docs: [Doc!]!
  }

  input DocsFetchQuery {
    queryString: String
    sortConfig: DocsSortConfig!
    state: DocState
    client: ID
    manager: ID
    agent: ID
    cursor: Int
  }

  # ------------------------------------
  # DocState type
  # ------------------------------------
  enum DocState {
    OPEN
    CLOSED
    CANCELED
  }

  # ------------------------------------
  # Payment type
  # ------------------------------------
  type Payment {
    date: Date!
    user: User!
    amount: Float
    meta: JSON!
  }

  # ------------------------------------
  # Vehicle type
  # ------------------------------------
  type Vehicle {
    manufacturer: String
    model: String
    plateNumber: ID!
    series: String
    mileage: String
    DMC: String
    energy: String
    power: String
  }

  # ------------------------------------
  # Validation type
  # ------------------------------------
  type DocValidationState {
    date: Date
    amount: Float
    user: User
  }

  # ------------------------------------
  # Closure type
  # ------------------------------------
  type DocClosureState {
    date: Date!
    user: User!
    state: DocState!
  }

  # ------------------------------------
  # Doc type
  # ------------------------------------
  type Doc {
    objectId: ID!
    id: ID!

    company: String

    key: ID!

    refNo: ID!

    date: Date!
    dateMission: Date!

    state: DocState!

    paymentInfo: Payment

    vehicle: Vehicle!

    client: User!
    manager: User
    agent: User!
    user: User!

    validation: DocValidationState
    closure: DocClosureState

    createdAt: Date!
    updatedAt: Date!

    lastModified: Date!

    deletion: Deletion

    business: Business

    police: String
    nature: String
  }

`,
];

export const resolvers = {
  Importation: objectAssign(
    {},
    {
      files(importation, {}, context) {
        return Promise.all(
          importation.get('files').map(id => context.Docs.getFile(id)),
        );
      },
    },
    parseGraphqlObjectFields(['user']),
    parseGraphqlScalarFields([
      'id',
      'date',
      'endDate',
      'docs',
      'progress',
      'total',
    ]),
  ),

  Vehicle: objectAssign(
    {},
    parseGraphqlObjectFields([]),
    parseGraphqlScalarFields([
      'manufacturer',
      'model',
      'plateNumber',
      'series',
      'mileage',
      'DMC',
      'energy',
      'power',
    ]),
  ),

  File: objectAssign(
    {},
    {
      deletion: file => {
        const deletion_date = file.get('deletion_date');
        const deletion_user = file.get('deletion_user');

        if (deletion_date && deletion_user) {
          return {
            date: deletion_date,
            user: deletion_user,
          };
        }

        return null;
      },
      url: file => {
        if (file.has('fileObj')) {
          try {
            return file.get('fileObj').url({ forceSecure: config.secure });
          } catch (e) {
            log.error('File.url threw error', e);
          }
        }

        return null;
      },
    },
    parseGraphqlObjectFields(['user']),
    parseGraphqlScalarFields(['name', 'category', 'type', 'size', 'date']),
  ),

  Observation: objectAssign(
    {},
    parseGraphqlObjectFields(['user', 'document']),
    parseGraphqlScalarFields(['id', 'text', 'date']),
  ),

  Doc: objectAssign(
    {},
    {
      objectId: doc => {
        return doc.id;
      },
      id: doc => {
        return doc.get(DOC_ID_KEY);
      },
      validation: doc => {
        const validation_date =
          doc.validation_date || doc.get('validation_date');
        const validation_amount =
          doc.validation_amount || doc.get('validation_amount');
        const validation_user =
          doc.validation_user || doc.get('validation_user');

        // if (validation_user) {
        return {
          amount: validation_amount || null,
          date: validation_date || null,
          user: validation_user || null,
          // };
        };

        return null;
      },
      paymentInfo: doc => {
        const payment_date = doc.payment_date || doc.get('payment_date');
        const payment_amount = doc.payment_amount || doc.get('payment_amount');
        const payment_user = doc.payment_user || doc.get('payment_user');
        const payment_meta = doc.payment_meta || doc.get('payment_meta');

        if (payment_date && payment_user) {
          return {
            date: payment_date,
            amount: payment_amount || null,
            user: payment_user,
            meta: payment_meta || {},
          };
        }

        return null;
      },
      closure: doc => {
        const closure_date = doc.closure_date || doc.get('closure_date');
        const closure_state = doc.closure_state || doc.get('closure_state');
        const closure_user = doc.closure_user || doc.get('closure_user');

        if (closure_date && closure_state && closure_user) {
          return {
            date: closure_date,
            state: closure_state,
            user: closure_user,
          };
        }

        return null;
      },
      deletion: doc => {
        const deletion_date = doc.deletion_date || doc.get('deletion_date');
        const deletion_user = doc.deletion_user || doc.get('deletion_user');

        if (deletion_date && deletion_user) {
          return {
            date: deletion_date,
            user: deletion_user,
          };
        }

        return null;
      },
      lastModified(doc, {}, context) {
        let ret;

        if (!context.user) {
          ret = doc.get ? doc.get('lastModified') : doc.lastModified;
        } else {
          ret = doc.get
            ? doc.get(`lastModified_${context.user.id}`) ||
              doc.get('lastModified') ||
              doc.updatedAt
            : doc[`lastModified_${context.user.id}`] ||
              doc.lastModified ||
              doc.updatedAt;
        }

        return typeof ret !== 'undefined' ? ret : null;
      },
    },
    parseGraphqlObjectFields([
      'business',

      'vehicle',

      'client',
      'manager',
      'agent',
      'user',
    ]),
    parseGraphqlScalarFields([
      'company',
      'refNo',
      'key',
      'date',
      'dateMission',
      'state',
      'createdAt',
      'updatedAt',
      'police',
      'nature',
    ]),
  ),

  ESDocSource: objectAssign(
    {},
    {
      id: doc => {
        return doc[DOC_ID_KEY];
      },
      validation: doc => {
        const validation_date = doc.validation_date;
        const validation_amount = doc.validation_amount;
        const validation_user = doc.validation_user;

        // if (validation_user) {
        return {
          date: validation_date || null,
          amount: validation_amount || null,
          user: validation_user || null,
          // };
        };
        return null;
      },
      paymentInfo: doc => {
        const payment_date = doc.payment_date;
        const payment_amount = doc.payment_amount;
        const payment_user = doc.payment_user;
        const payment_meta = doc.payment_meta;

        if (payment_date && payment_user) {
          return {
            date: payment_date,
            amount: payment_amount || null,
            user: payment_user,
            meta: payment_meta || {},
          };
        }

        return null;
      },
      closure: doc => {
        const closure_date = doc.closure_date;
        const closure_state = doc.closure_state;
        const closure_user = doc.closure_user;

        if (closure_date && closure_state && closure_user) {
          return {
            date: closure_date,
            state: closure_state,
            user: closure_user,
          };
        }

        return null;
      },
      lastModified(doc, {}, context) {
        let ret;

        if (!context.user) {
          ret = doc.lastModified;
        } else {
          ret = doc[`lastModified_${context.user.id}`] || doc.lastModified;
        }

        return typeof ret !== 'undefined' ? ret : null;
      },
    },
    parseGraphqlScalarFields([
      'vehicle',

      'client',
      'manager',
      'agent',
      'user',

      'company',
      'refNo',
      'date',
      'dateMission',
      'state',

      'police',
      'nature',
    ]),
  ),

  ESDoc: objectAssign({
    highlight(_source, {}, {}) {
      return Object.keys(_source.highlight || {});
    },
  }),

  AddDocResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'errors', 'error']),
  ),

  DelOrRestoreDocResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  SetOrDelPayResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  SetOrDelNatureResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  SetOrDelPoliceResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  SetOrDelDTValidationResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  SetOrDelMTRapportsResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  DocObservationsResponse: objectAssign(
    {},
    parseGraphqlObjectFields([]),
    parseGraphqlScalarFields(['items', 'prevCursor', 'cursor']),
  ),

  UploadFileResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc', 'file']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  DelOrRestoreFileResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc', 'file']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  SetManagerResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc', 'manager']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  SetStateResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  ImportResponse: objectAssign(
    {},
    parseGraphqlObjectFields(['doc']),
    parseGraphqlScalarFields(['activities', 'error']),
  ),

  ImportationResponse: objectAssign(
    {},
    parseGraphqlObjectFields([]),
    parseGraphqlScalarFields(['error']),
  ),

  Mutation: {
    async addDoc(_, { payload, meta }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      try {
        const docValidations = getDocValidations(context);
        await docValidations.asyncValidate(fromJS({ ...payload }));
      } catch (errors) {
        return { errors, activities: [] };
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
          errors: {},
        };
      }

      if (userHasRoleAny(context.user, Role_ADMINISTRATORS, Role_MANAGERS)) {
        function getUser({ key, id, displayName, email }) {
          if (key === 'id') {
            return { key, id };
          }

          // if (key === 'userData') {
          return { key: 'userData', userData: { displayName, email } };
          // }

          // throw new Error(`addDoc: Invalid user entry`);
        }

        const data = {
          dateMission: payload.dateMission,
          date: payload.date,

          company: payload.company,

          vehicle: {
            manufacturer: payload.vehicleManufacturer,
            model: payload.vehicleModel,
            plateNumber: payload.vehiclePlateNumber,
            series: payload.vehicleSeries,
            mileage: payload.vehicleMileage,
            DMC: payload.vehicleDMC,
            energy: payload.vehicleEnergy,
            power: payload.vehiclePower,
          },

          client: getUser({
            key: payload.clientKey,
            id: payload.clientId,
            displayName: payload.clientDisplayName,
            email: payload.clientEmail,
          }),

          agent: getUser({
            key: payload.agentKey,
            id: payload.agentId,
            displayName: payload.agentDisplayName,
            email: payload.agentEmail,
          }),
        };

        const { doc, activities } = await context.Docs.addDoc(data, meta);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities, errors: {} };
      }

      return {
        activities: [],
        error: { code: codes.ERROR_NOT_AUTHORIZED },
        errors: {},
      };
    },
    async delDoc(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (!userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
        return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
      }

      const { doc, activities } = await context.Docs.delDoc(id);
      // publish subscription notification
      try {
        pubsub.publish(Topics.ACTIVITY, {
          id: activities[activities.length - 1].id,
        });
      } catch (e) {}

      return { activities, doc };
    },
    async restoreDoc(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (!userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
        return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
      }

      const { doc, activities } = await context.Docs.restoreDoc(id);
      // publish subscription notification
      try {
        pubsub.publish(Topics.ACTIVITY, {
          id: activities[activities.length - 1].id,
        });
      } catch (e) {}

      return { activities, doc };
    },
    async setManager(_, { id, manager }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
        const { doc, manager: user, activities } = await context.Docs.setManager(
          id,
          manager,
        );
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, manager: user, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async setNature(_, { id, value }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      try {
        await natureValidations.asyncValidate(fromJS({ nature: value }));
      } catch (errors) {
        return { errors, activities: [] };
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.setNature(id, { value });
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async delNature(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.delNature(id);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async setPolice(_, { id, value }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      try {
        await policeValidations.asyncValidate(fromJS({ police: value }));
      } catch (errors) {
        return { errors, activities: [] };
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.setPolice(id, { value });
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async delPolice(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.delPolice(id);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async setDTValidation(_, { id, info }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      try {
        await validationValidations.asyncValidate(fromJS({ ...info }));
      } catch (errors) {
        return { errors, activities: [] };
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.setDTValidation(id, info);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async delDTValidation(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.delDTValidation(id);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async setMTRapports(_, { id, info }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      try {
        await mtRapportsValidations.asyncValidate(fromJS({ ...info }));
      } catch (errors) {
        return { errors, activities: [] };
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.setMTRapports(id, info);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async delMTRapports(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.delMTRapports(id);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async setPay(_, { id, info }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      try {
        await payValidations.asyncValidate(fromJS({ ...info }));
      } catch (errors) {
        return { errors, activities: [] };
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.setPay(id, info);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async delPay(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.delPay(id);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async setState(_, { id, state }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        const { doc, activities } = await context.Docs.setState(id, state);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async closeDoc(_, { id, info, meta }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      try {
        const validations = getClosureValidations(meta ? meta.importing : false);
        await validations.asyncValidate(fromJS({ ...info }));
      } catch (errors) {
        return { errors, activities: [] };
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      async function isDocOpen(id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.get('state') === 'OPEN';
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        if (!await isDocOpen(id)) {
          return {
            activities: [],
            error: { code: codes.ERROR_ILLEGAL_OPERATION },
          };
        }

        const { doc, activities } = await context.Docs.closeDoc(id, info, {
          ...meta,
        });
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async cancelDoc(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      async function isDocManager(user, id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === user.id;
        }
        return false;
      }

      async function isDocOpen(id) {
        const doc = await context.Docs.get(id);
        if (doc) {
          return doc.get('state') === 'OPEN';
        }
        return false;
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (await isDocManager(request.user, id))
      ) {
        if (!await isDocOpen(id)) {
          return {
            activities: [],
            error: { code: codes.ERROR_ILLEGAL_OPERATION },
          };
        }

        const { doc, activities } = await context.Docs.cancelDoc(id);
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { doc, activities };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async uploadFile(_, { docId, category, metadata }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      async function isManager() {
        const doc = await context.Docs.get(docId);
        if (doc) {
          return doc.has('manager') && doc.get('manager').id === context.user.id;
        }
        return false;
      }

      if (
        userHasRoleAll(context.user, Role_ADMINISTRATORS) ||
        (userHasRoleAll(context.user, Role_MANAGERS) && (await isManager()))
      ) {
        const { file, activities } = await context.Docs.uploadFile({
          docId,
          category,
          metadata,
        });
        // publish subscription notification
        try {
          pubsub.publish(Topics.ACTIVITY, {
            id: activities[activities.length - 1].id,
          });
        } catch (e) {}

        return { file, activities, errors: {} };
      }

      return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    },
    async delFile(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      async function isManager() {
        const file = await context.Docs.getFile(id);
        if (file) {
          const doc = await context.Docs.get(file.get('document').id);
          if (doc) {
            return (
              doc.has('manager') && doc.get('manager').id === context.user.id
            );
          }
        }
        return false;
      }

      async function isValid() {
        const file = await context.Docs.getFile(id);
        if (file) {
          const doc = await context.Docs.get(file.get('document').id);
          if (doc) {
            return !doc.has('deletion_date') && doc.get('state') === 'OPEN';
          }
        }
        return false;
      }

      if (
        !userHasRoleAll(context.user, Role_ADMINISTRATORS) &&
        !(
          userHasRoleAll(context.user, Role_MANAGERS) &&
          !await isValid() &&
          !await isManager()
        )
      ) {
        return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
      }

      const { file, activities } = await context.Docs.delFile(id);
      // publish subscription notification
      try {
        pubsub.publish(Topics.ACTIVITY, {
          id: activities[activities.length - 1].id,
        });
      } catch (e) {}

      return { activities, file };
    },
    async restoreFile(_, { id }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return {
          activities: [],
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      async function isManager() {
        const file = await context.Docs.getFile(id);
        if (file) {
          const doc = await context.Docs.get(file.get('document').id);
          if (doc) {
            return (
              doc.has('manager') && doc.get('manager').id === context.user.id
            );
          }
        }
        return false;
      }

      if (
        !userHasRoleAll(context.user, Role_ADMINISTRATORS) &&
        !(userHasRoleAll(context.user, Role_MANAGERS) && !await isManager())
      ) {
        return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
      }

      const { file, activities } = await context.Docs.restoreFile(id);
      // publish subscription notification
      try {
        pubsub.publish(Topics.ACTIVITY, {
          id: activities[activities.length - 1].id,
        });
      } catch (e) {}

      return { activities, file };
    },

    // Importations
    Importation(_, { info: { date, files, docs } }, context) {
      if (!context.user) {
        throw new Error('A user is required.');
      }

      if (!userVerified(context.user)) {
        return {
          error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
        };
      }

      if (!userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
        return { error: { code: codes.ERROR_NOT_AUTHORIZED } };
      }

      return new Promise(async (resolve, reject) => {
        let importation = await context.Docs.ongoingImportation();

        if (importation) {
          reject({ error: { code: codes.ERROR_ILLEGAL_OPERATION } });
          return;
        }

        try {
          const { activity } = await context.Docs.startImportation(
            {
              date,
              files,
              docs,
            },
            context,
          );

          process.nextTick(() => {
            // publish subscription notification
            pubsub.publish(Topics.ACTIVITY, {
              id: activity.id,
              broadcast: true,
            });
          });

          importation = activity.get('importation');
        } catch (e) {
          reject({ error: { code: codes.ERROR_UNKNOWN } });
          return;
        }

        const insertions = orderBy(docs, ['progress'], ['asc']);

        const fns = insertions.map(doc => getInsertFn(doc));

        async.series(fns, async function(err) {
          if (err) {
            reject({ error: { code: codes.ERROR_UNKNOWN } });
            return;
          }

          try {
            const moment = getMoment(context.locale, moment => moment.utc);

            const { activity } = await context.Docs.finishImportation({
              id: importation.id,
              endDate: +moment(),
            });

            process.nextTick(() => {
              // publish subscription notification
              pubsub.publish(Topics.ACTIVITY, {
                id: activity.id,
                broadcast: true,
              });
            });
            resolve({});
          } catch (e) {
            reject({ error: { code: codes.ERROR_UNKNOWN } });
          }
        });

        function getInsertFn(payload) {
          return async function(done) {
            const startTime = Date.now();
            try {
              const data = {
                id: payload.id,

                progress: payload.progress,

                dateMission: payload.dateMission,
                date: payload.date,

                dateValidation: payload.dateValidation,

                paymentDate: payload.paymentDate,

                company: payload.company,

                vehicle: {
                  manufacturer: payload.vehicleManufacturer,
                  model: payload.vehicleModel,
                  plateNumber: payload.vehiclePlateNumber,
                  series: payload.vehicleSeries,
                  mileage: payload.vehicleMileage,
                  DMC: payload.vehicleDMC,
                  energy: payload.vehicleEnergy,
                  power: payload.vehiclePower,
                },

                client: getUser({
                  key: payload.clientKey,
                  id: payload.clientId,
                  displayName: payload.clientDisplayName,
                }),

                agent: getUser({
                  key: payload.agentKey,
                  id: payload.agentId,
                  displayName: payload.agentDisplayName,
                }),
              };

              const { activities, doc } = await context.Docs.Import({
                id: importation.id,
                doc: data,
              });

              // Ops should take at least 3secs
              await delay(Math.max(0, 3000 - (Date.now() - startTime)));

              // publish subscription notification
              process.nextTick(() => {
                try {
                  pubsub.publish(Topics.ACTIVITY, {
                    id: activities[activities.length - 1].id,
                    broadcast: true,
                  });
                } catch (e) {}
              });

              return {};
            } catch (e) {
              throw e;
            }

            function getUser({ key, id, displayName }) {
              if (key === 'id') {
                return { key, id };
              }

              // if (key === 'userData') {
              return { key: 'userData', userData: { displayName } };
              // }

              // throw new Error(`addDoc: Invalid user entry`);
            }
          };
        }
      });
    },
    // async startImportation(_, { info: { date, files, docs } }, context) {
    //   if (!context.user) {
    //     throw new Error('A user is required.');
    //   }
    //
    //   if (!userVerified(context.user)) {
    //     return {
    //       error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
    //     };
    //   }
    //
    //   if (!userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
    //     return { error: { code: codes.ERROR_NOT_AUTHORIZED } };
    //   }
    //
    //   const { activity } = await context.Docs.startImportation(
    //     {
    //       date,
    //       files,
    //       docs,
    //     },
    //     context,
    //   );
    //   // publish subscription notification
    //   pubsub.publish(Topics.ACTIVITY, {
    //     id: activity.id,
    //   });
    //   return { activity };
    // },
    // async Import(_, { id, doc: payload }, context) {
    //   if (!context.user) {
    //     throw new Error('A user is required.');
    //   }
    //
    //   if (!userVerified(context.user)) {
    //     return {
    //       activities: [],
    //       error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
    //     };
    //   }
    //
    //   if (!userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
    //     return { activities: [], error: { code: codes.ERROR_NOT_AUTHORIZED } };
    //   }
    //
    //   function getUser({ key, id, displayName }) {
    //     if (key === 'id') {
    //       return { key, id };
    //     }
    //
    //     // if (key === 'userData') {
    //     return { key: 'userData', userData: { displayName } };
    //     // }
    //
    //     // throw new Error(`addDoc: Invalid user entry`);
    //   }
    //
    //   const info = {
    //     id: payload.id,
    //
    //     progress: payload.progress,
    //
    //     dateMission: payload.dateMission,
    //     date: payload.date,
    //
    //     dateValidation: payload.dateValidation,
    //
    //     paymentDate: payload.paymentDate,
    //
    //     company: payload.company,
    //
    //     vehicle: {
    //       manufacturer: payload.vehicleManufacturer,
    //       model: payload.vehicleModel,
    //       plateNumber: payload.vehiclePlateNumber,
    //       series: payload.vehicleSeries,
    //       mileage: payload.vehicleMileage,
    //       DMC: payload.vehicleDMC,
    //       energy: payload.vehicleEnergy,
    //       power: payload.vehiclePower,
    //     },
    //
    //     client: getUser({
    //       key: payload.clientKey,
    //       id: payload.clientId,
    //       displayName: payload.clientDisplayName,
    //     }),
    //
    //     agent: getUser({
    //       key: payload.agentKey,
    //       id: payload.agentId,
    //       displayName: payload.agentDisplayName,
    //     }),
    //   };
    //
    //   const { activities, doc } = await context.Docs.Import({
    //     id,
    //     doc: data,
    //   });
    //   // publish subscription notification
    //   try {
    //     pubsub.publish(Topics.ACTIVITY, {
    //       id: activities[activities.length - 1].id,
    //     });
    //   } catch (e) {}
    //
    //   return { activities, doc };
    // },
    // async finishImportation(_, { id, endDate }, context) {
    //   if (!context.user) {
    //     throw new Error('A user is required.');
    //   }
    //
    //   if (!userVerified(context.user)) {
    //     return {
    //       error: { code: codes.ERROR_ACCOUNT_NOT_VERIFIED },
    //     };
    //   }
    //
    //   if (!userHasRoleAll(context.user, Role_ADMINISTRATORS)) {
    //     return { error: { code: codes.ERROR_NOT_AUTHORIZED } };
    //   }
    //
    //   const { activity } = await context.Docs.finishImportation({
    //     id,
    //     endDate,
    //   });
    //   // publish subscription notification
    //   pubsub.publish(Topics.ACTIVITY, {
    //     id: activity.id,
    //   });
    //   return { activity };
    // },
  },

  Query: {
    getDoc(obj, { id }, context) {
      return context.Docs.get(id);
    },
    getImportation(obj, { id }, context) {
      return context.Docs.getImportation(id);
    },
    ongoingImportation(obj, {}, context) {
      return context.Docs.ongoingImportation();
    },
    getFile(obj, { id }, context) {
      return context.Docs.getFile(id);
    },
    getDocs(obj, { query }, context, info) {
      const topLevelFields = Object.keys(graphqlFields(info));
      return context.Docs.getDocs(query, topLevelFields);
    },
    // usersByRoles(obj, { queryString, roles }, context) {
    //   return context.Docs.searchUsersByRoles(queryString, roles);
    // },

    esUsersByRoles(obj, { queryString, roles }, context) {
      return context.Docs.esSearchUsersByRoles(queryString, roles);
    },
    esSearchDocs(obj, { queryString, state }, context) {
      return context.Docs.esSearchDocs(queryString, state);
    },
    esQueryDocs(obj, { query }, context) {
      return context.Docs.esQueryDocs(query);
    },
    async esQueryDocsToExcel(obj, { query }, context) {
      try {
        const data = await context.Docs.esQueryDocsToExcel(query);
        return { data };
      } catch (e) {
        return { error: { code: e.code || codes.ERROR_UNKNOWN } };
      }
    },

    openDashboard(
      _,
      { durationInDays, cursor = 0, sortConfig, validOnly },
      context,
      info,
    ) {
      const selectionSet = Object.keys(graphqlFields(info));
      return context.Docs.openDashboard(
        durationInDays,
        cursor,
        sortConfig,
        selectionSet,
        validOnly,
        context.Now,
      );
    },
    async openDashboardToExcel(
      _,
      { durationInDays, cursor = 0, sortConfig, validOnly },
      context,
      info,
    ) {
      const selectionSet = ['cursor', 'docs'];
      try {
        const { docs } = await context.Docs.openDashboard(
          durationInDays,
          cursor,
          sortConfig,
          selectionSet,
          validOnly,
          context.Now,
          /* returnAll = */ true,
        );

        return {
          data: await helpers.docsToExcel({
            docs: docs.map(doc => ({
              id: doc.id,
              refNo: doc.get('refNo'),
              company: doc.get('company'),
              date: doc.get('date'),
              dateMission: doc.get('dateMission'),
              vehicle: doc.has('vehicle')
                ? {
                    manufacturer: doc.get('vehicle').manufacturer,
                    model: doc.get('vehicle').model,
                    plateNumber: doc.get('vehicle').plateNumber,
                    series: doc.get('vehicle').series,
                  }
                : {},
              client: {
                name: doc.has('client')
                  ? doc.get('client').get('displayName')
                  : null,
              },
              agent: {
                name: doc.has('agent')
                  ? doc.get('agent').get('displayName')
                  : null,
              },
              police: doc.get('police'),
              nature: doc.get('nature'),
              validation_date: doc.get('validation_date'),
              payment_date: doc.get('payment_date'),
            })),
          }),
        };
      } catch (e) {
        return { error: { code: codes.ERROR_UNKNOWN } };
      }
    },
    // closedDashboard(_, { durationInDays, cursor = 0, sortConfig, includeCanceled }, context, info) {
    //   const selectionSet = Object.keys(graphqlFields(info));
    //   return context.Docs.closedDashboard(
    //     durationInDays,
    //     cursor,
    //     sortConfig,
    //     selectionSet,
    //     includeCanceled,
    //     context.Now,
    //   );
    // },

    recentDocs(_, {}, context) {
      return context.Docs.recent();
    },

    dashboard(_, {}, context, info) {
      const selectionSet = Object.keys(graphqlFields(info));
      return context.Docs.dashboard(selectionSet);
    },

    getLastRefNo(_, { now }, context) {
      return context.Business.getLastRefNo(now);
    },

    getDocFiles(_, { id }, context) {
      return context.Docs.getDocFiles(id);
    },

    isDocValid(_, { id }, context) {
      return context.Docs.isDocValid(id);
    },
    getInvalidDocs(
      _,
      { category, durationInDays, cursor = 0, sortConfig },
      context,
      info,
    ) {
      const selectionSet = Object.keys(graphqlFields(info));
      return context.Docs.getInvalidDocs({
        category,
        durationInDays,
        cursor,
        sortConfig,
        selectionSet,
        now: context.Now,
      });
    },
    async getInvalidDocsToExcel(
      _,
      { category, durationInDays, cursor = 0, sortConfig },
      context,
      info,
    ) {
      const selectionSet = ['cursor', 'docs'];
      try {
        const { docs } = await context.Docs.getInvalidDocs({
          category,
          durationInDays,
          cursor,
          sortConfig,
          selectionSet,
          now: context.Now,
          returnAll: true,
        });

        return {
          data: await helpers.docsToExcel({
            docs: docs.map(doc => ({
              id: doc.id,
              refNo: doc.get('refNo'),
              company: doc.get('company'),
              date: doc.get('date'),
              dateMission: doc.get('dateMission'),
              vehicle: doc.has('vehicle')
                ? {
                    manufacturer: doc.get('vehicle').manufacturer,
                    model: doc.get('vehicle').model,
                    plateNumber: doc.get('vehicle').plateNumber,
                    series: doc.get('vehicle').series,
                  }
                : {},
              client: {
                name: doc.has('client')
                  ? doc.get('client').get('displayName')
                  : null,
              },
              agent: {
                name: doc.has('agent')
                  ? doc.get('agent').get('displayName')
                  : null,
              },
              police: doc.get('police'),
              nature: doc.get('nature'),
              validation_date: doc.get('validation_date'),
              payment_date: doc.get('payment_date'),
            })),
          }),
        };
      } catch (e) {
        return { error: { code: codes.ERROR_UNKNOWN } };
      }
    },
    getUnpaidDocs(_, { durationInDays, cursor = 0, sortConfig }, context, info) {
      const selectionSet = Object.keys(graphqlFields(info));
      return context.Docs.getUnpaidDocs({
        durationInDays,
        cursor,
        sortConfig,
        selectionSet,
        now: context.Now,
      });
    },
    async getUnpaidDocsToExcel(
      _,
      { durationInDays, cursor = 0, sortConfig },
      context,
      info,
    ) {
      const selectionSet = ['cursor', 'docs'];
      try {
        const { docs } = await context.Docs.getUnpaidDocs({
          durationInDays,
          cursor,
          sortConfig,
          selectionSet,
          now: context.Now,
          returnAll: true,
        });

        return {
          data: await helpers.docsToExcel({
            docs: docs.map(doc => ({
              id: doc.id,
              refNo: doc.get('refNo'),
              company: doc.get('company'),
              date: doc.get('date'),
              dateMission: doc.get('dateMission'),
              vehicle: doc.has('vehicle')
                ? {
                    manufacturer: doc.get('vehicle').manufacturer,
                    model: doc.get('vehicle').model,
                    plateNumber: doc.get('vehicle').plateNumber,
                    series: doc.get('vehicle').series,
                  }
                : {},
              client: {
                name: doc.has('client')
                  ? doc.get('client').get('displayName')
                  : null,
              },
              agent: {
                name: doc.has('agent')
                  ? doc.get('agent').get('displayName')
                  : null,
              },
              police: doc.get('police'),
              nature: doc.get('nature'),
              validation_date: doc.get('validation_date'),
              payment_date: doc.get('payment_date'),
            })),
          }),
        };
      } catch (e) {
        return { error: { code: codes.ERROR_UNKNOWN } };
      }
    },

    getDocObservations(_, { id, cursor }, context) {
      return context.Docs.getDocObservations({ id, cursor });
    },

    searchVehicles(_, { queryString }, context) {
      return context.Docs.searchVehicles(queryString);
    },
    vehicleByPlateNumber(_, { plateNumber }, context) {
      return context.Docs.vehicleByPlateNumber(plateNumber);
    },

    queryCompanies(_, { queryString }, context) {
      return context.Docs.queryCompanies(queryString);
    },
  },
};
