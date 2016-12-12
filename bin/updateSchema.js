import fs from 'fs';
import path from 'path';
import { schema as Schema, resolvers as Resolvers } from 'data/schema';
import {
  makeExecutableSchema,
} from 'graphql-tools';
import { graphql }  from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
const error = require('debug')('app:bin:graphql:error');

// Save JSON of full schema introspection
const executableSchema = makeExecutableSchema({
  typeDefs                : Schema,
  resolvers               : Resolvers,
  allowUndefinedInResolve : false,
  logger                  : { log: (e) => error('[GRAPHQL ERROR]', e.stack) },
});
graphql(executableSchema, introspectionQuery).then(result => {
  if (result.errors) {
    error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    );
  } else {
    fs.writeFileSync(
      path.join(__dirname, '../data/schema.json'),
      JSON.stringify(result, null, 2)
    );
  }
});
// Save user readable type system shorthand of schema
fs.writeFileSync(
  path.join(__dirname, '../data/schema.graphql'),
  printSchema(executableSchema)
);

