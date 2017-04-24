import {printAST} from 'apollo-client'

import RecursiveIterator from 'recursive-iterator'
import objectPath from 'object-path'

import objectAssign from 'object-assign'

export function addUploads(networkInterface) {
  const _batchedFetchFromRemoteEndpoint = networkInterface.batchedFetchFromRemoteEndpoint.bind(networkInterface);

  return objectAssign(networkInterface, {
    batchedFetchFromRemoteEndpoint ({requests, options}) {
      // Extract any files from the request
      const batchFiles = []
      const batchOperations = requests.map((request, operationIndex) => {
        const {operation, files} = extractRequestFiles(request)
        if (files.length) {
          batchFiles.push({
            operationIndex,
            files
          })
        }
        return operation
      })

      // Only initiate a multipart form request if there are uploads
      if (batchFiles.length) {
        // For each operation, convert query AST to string for transport
        batchOperations.forEach((operation) => {
          if (operation.query) {
            operation.query = printAST(operation.query)
          }
        })

        // Build the form
        const formData = new FormData()
        formData.append('operations', JSON.stringify(batchOperations))
        batchFiles.forEach(({operationIndex, files}) => {
          files.forEach(({variablesPath, file}) => formData.append(`${operationIndex}.${variablesPath}`, file))
        })

        // Send request
        return fetch(this._uri, {
          method: 'POST',
          body: formData,
          ...options
        })
      }

      // Standard fetch method fallback
      return _batchedFetchFromRemoteEndpoint({requests, options});
    },
  });
}


/**
 * Extracts files from an Apollo Client Request, remembering positions in variables.
 * @see {@link http://dev.apollodata.com/core/apollo-client-api.html#Request}
 * @param {Object} request - Apollo GraphQL request to be sent to the server.
 * @param {Object} request.variables - GraphQL variables map.
 * @param {string} request.operationName - Name of the GraphQL query or mutation.
 * @returns {Object} - Request with files extracted to a list with their original object paths.
 */
function extractRequestFiles (request) {
  const files = []
  let variablesPath

  // Recursively search GraphQL input variables for FileList or File objects
  for (let {node, path} of new RecursiveIterator(request.variables)) {
    const isFileList = node instanceof FileList
    const isFile = node instanceof File

    if (isFileList || isFile) {
      // Only populate when necessary
      if (!variablesPath) variablesPath = objectPath(request.variables)

      const pathString = path.join('.')

      if (isFileList) {
        // Convert to FileList to File array. This is
        // necessary so items can be manipulated correctly
        // by object-path. Either format may be used when
        // populating GraphQL variables on the client.
        variablesPath.set(pathString, Array.from(node))
      } else if (isFile) {
        // Move the File object to a multipart form field
        // with the field name holding the original path
        // to the file in the GraphQL input variables.
        files.push({
          variablesPath: `variables.${pathString}`,
          file: node
        })
        variablesPath.del(pathString)
      }
    }
  }

  return {
    operation: request,
    files
  }
}

