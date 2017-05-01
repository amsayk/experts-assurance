import Parse from 'parse/node';

import Config from 'parse-server/lib/Config';

const FileController = {
  saveFile(name: string, source: FileSource) {
  },

  saveBase64(name: string, source: FileSource) {
    if (source.format !== 'base64') {
      throw new Error('saveBase64 can only be used with Base64-type sources.');
    }

    const config = new Config(Parse.applicationId);

    const op = config.filesController.createFile(
      config,
      name,
      Buffer.from(source.base64, 'base64'),
      source.type,
    );

    return Parse.Promise.resolve(op);
  }
}

export default FileController;

