import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';

export const schema = [`

  enum ActivityNS {
    DOCUMENTS
  }

  enum ActivityType {
    DOCUMENT_CREATED
    DOCUMENT_STATE_CHANGED
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

    document: Doc

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

  Activity: Object.assign(
    {
    },
    parseGraphqlObjectFields([
      'business',
      'document',
      'metadata',
      'user',
    ]),
    parseGraphqlScalarFields([
      'id',
      'ns',
      'type',
      'timestamp',
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

