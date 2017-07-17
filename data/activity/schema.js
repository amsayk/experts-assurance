import parseGraphqlScalarFields from 'data/parseGraphqlScalarFields';
import parseGraphqlObjectFields from 'data/parseGraphqlObjectFields';

import objectAssign from 'object-assign';

import invariant from 'invariant';

export const schema = [`

  enum ActivityNS {
    DOCUMENTS
  }

  enum ActivityType {
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

    type: ActivityType!
    timestamp: Date!
    metadata: JSON!

    createdAt: Date!
    updatedAt: Date!

    business: Business

    user: User
  }

`];

export const resolvers = {

  Activity: objectAssign(
    {
    },
    {
      document: (activity, {}, context) => {
        const ref = activity.get('ref');

        invariant(ref, 'Activity.document resolver: ref is required.');
        return context.Docs.get(ref);
      },

    },
    parseGraphqlObjectFields([
      'business',
      'file',
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
    ])
  ),

  Mutation: {

  },

  Query: {
    timeline(obj, { cursor, query }, context) {
      return context.Activities.getTimeline(cursor, query);
    },
  },

};

