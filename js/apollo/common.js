import {
  print,
} from 'graphql';

// Apply queryTransformers to a query document.
export function applyQueryTransformers(
  document,
  queryTransformers = []
) {
  let currentDocument = document;
  queryTransformers.forEach((transformer) => {
    currentDocument = transformer(currentDocument);
  });
  return currentDocument;
}

// Returns a key for a query operation definition. Currently just uses GraphQL printing as a
// serialization mechanism; may use hashes or ids in the future. Also applies the query
// transformers to the query definition before returning the key.
export function getQueryKey(
  definition,
  queryTransformers = [],
) {
  const wrappingDocument = {
    kind: 'Document',
    definitions: [ definition ],
  };
  return print(applyQueryTransformers(
    wrappingDocument,
    queryTransformers
  ).definitions[0]);
}

// Returns a key for a query in a document definition. Should include exactly one query and a set
// of fragments that the query references. Currently just uses GraphQL printing as a serialization
// mechanism; may use hashes or ids in the future. Also applies query transformers to the document
// before making it a document key.
export function getQueryDocumentKey(
  document,
  queryTransformers = [],
) {
  return print(applyQueryTransformers(document, queryTransformers));
}

