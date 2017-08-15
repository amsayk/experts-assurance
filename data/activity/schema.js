import parseGraphqlScalarFields from 'data/parseGraphqlScalarFields';
import parseGraphqlObjectFields from 'data/parseGraphqlObjectFields';

import { withFilter } from 'graphql-subscriptions';

import objectAssign from 'object-assign';

import invariant from 'invariant';

import { DOC_FOREIGN_KEY } from 'backend/constants';

import { pubsub } from 'data/subscriptions';

import { Topics } from 'backend/constants';

export const schema = [
  `

  enum ActivityNS {
    DOCUMENTS
  }

  enum ActivityType {
    IMPORTATION

    PAYMENT_CHANGED
    DT_VALIDATION_CHANGED
    MT_RAPPORTS_CHANGED
    NATURE_CHANGED
    POLICE_CHANGED

    FILE_UPLOADED
    FILE_DELETED
    FILE_RESTORED

    DOCUMENT_CREATED
    DOCUMENT_STATE_CHANGED
    DOCUMENT_DELETED
    DOCUMENT_RESTORED
    DOCUMENT_MANAGER_CHANGED
  }

  # Queries

  input TimelineQuery {
    doc: ID
    ns: ActivityNS
    types: [ActivityType!]
  }

  type TimelineResponse {
    result: [Activity!]!
    prevCursor: Date
    cursor: Date
  }

  # ------------------------------------
  # Activity type
  # ------------------------------------
  type Activity {
    id: ID!

    now: Date!
    document: Doc
    file: File

    ns: ActivityNS!

    importation: Importation

    type: ActivityType!
    timestamp: Date!
    metadata: JSON!

    createdAt: Date!
    updatedAt: Date!

    business: Business

    user: User
  }

  type ActivityEventResponse {
    sessionToken: String!
    activity: Activity!
  }

`,
];

export const resolvers = {
  Activity: objectAssign(
    {},
    {
      document: (activity, {}, context) => {
        const ref = activity.get(DOC_FOREIGN_KEY);

        invariant(
          ref || activity.get('type') === 'IMPORTATION',
          `Activity.document resolver: ${DOC_FOREIGN_KEY} is required.`,
        );
        return ref ? context.Docs.get(ref) : null;
      },
    },
    parseGraphqlObjectFields([
      'business',
      'file',
      'importation',
      'metadata',
      'user',
    ]),
    parseGraphqlScalarFields([
      'id',
      'ns',
      'type',
      'timestamp',
      'now',
      'createdAt',
      'updatedAt',
    ]),
  ),

  Mutation: {},

  Query: {
    timeline(obj, { cursor, query }, context) {
      return context.Activities.getTimeline({ cursor, query });
    },
  },
  Subscription: {
    onActivityEvent: {
      async resolve({ id }, {}, context, info) {
        return {
          sessionToken: context.session.getSessionToken(),
          activity: await context.Activities.get(id),
        };
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator([Topics.ACTIVITY]),
        ({ broadcast = false }, { sessionToken }, context) =>
          broadcast || sessionToken !== context.session.getSessionToken(),
      ),
    },
  },
};
