import parseGraphqlScalarFields from '../parseGraphqlScalarFields';
import parseGraphqlObjectFields from '../parseGraphqlObjectFields';

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

  Activity: Object.assign(
    {
    },
    parseGraphqlObjectFields([
      'business',
      'document',
      'file',
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

