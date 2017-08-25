'use strict';
// FileSystemAdapter
//
// Stores files in local file system
// Requires write access to the server's file system.

var fs = require('fs');
var path = require('path');
var pathSep = require('path').sep;
var categories = require('file-categories').default;
var memoizeStringOnly = require('memoizeStringOnly');

function FileSystemAdapter(options) {
  options = options || {};
  let filesSubDirectory = options.filesSubDirectory || '';
  this._filesDir = filesSubDirectory;
  this._mkdir(this._getApplicationDir());
  if (!this._applicationDirExist()) {
    throw `Files directory doesn't exist.`;
  }
}

FileSystemAdapter.prototype.createFile = function(filename, data) {
  return new Promise((resolve, reject) => {
    let filepath = this._getLocalFilePath(filename);
    fs.writeFile(filepath, data, err => {
      if (err !== null) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

FileSystemAdapter.prototype.deleteFile = function(filename) {
  return new Promise((resolve, reject) => {
    let filepath = this._getLocalFilePath(filename);
    fs.readFile(filepath, function(err, data) {
      if (err !== null) {
        return reject(err);
      }
      fs.unlink(filepath, unlinkErr => {
        if (err !== null) {
          return reject(unlinkErr);
        }
        resolve(data);
      });
    });
  });
};

FileSystemAdapter.prototype.getFileData = function(filename) {
  return new Promise((resolve, reject) => {
    let filepath = this._getLocalFilePath(filename);
    fs.readFile(filepath, function(err, data) {
      if (err !== null) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

FileSystemAdapter.prototype.getFileLocation = function(config, filename) {
  return (
    config.mount +
    '/files/' +
    config.applicationId +
    '/' +
    encodeURIComponent(filename)
  );
};

/*
  Helpers
 --------------- */
FileSystemAdapter.prototype._getApplicationDir = function() {
  if (this._filesDir) {
    return path.join('files', this._filesDir);
  } else {
    return 'files';
  }
};

FileSystemAdapter.prototype._applicationDirExist = function() {
  return fs.existsSync(this._getApplicationDir());
};

FileSystemAdapter.prototype._getLocalFilePath = function(filename) {
  let applicationDir = this._getApplicationDir();
  if (!fs.existsSync(applicationDir)) {
    this._mkdir(applicationDir);
  }
  let pathinfo = this._splitFilename(filename);
  if (pathinfo && pathinfo.name) {
    const tree = [applicationDir];

    if (pathinfo.id) {
      tree.push(pathinfo.id);
    }

    if (pathinfo.category) {
      tree.push(encodeURIComponent(pathinfo.category));
    }

    let fileDir = path.join(...tree);
    if (!fs.existsSync(fileDir)) {
      this._mkdir(fileDir);
    }

    return path.join(fileDir, encodeURIComponent(pathinfo.name));
  } else {
    return path.join(applicationDir, encodeURIComponent(filename));
  }
};

FileSystemAdapter.prototype._mkdir = function(dirPath) {
  // snippet found on -> https://gist.github.com/danherbert-epam/3960169
  let dirs = dirPath.split(pathSep);
  var root = '';

  while (dirs.length > 0) {
    var dir = dirs.shift();
    if (dir === '') {
      // If directory starts with a /, the first path will be an empty string.
      root = pathSep;
    }
    if (!fs.existsSync(path.join(root, dir))) {
      try {
        fs.mkdirSync(path.join(root, dir));
      } catch (e) {
        if (e.code == 'EACCES') {
          throw new Error(
            `PERMISSION ERROR: In order to use the FileSystemAdapter, write access to the server's file system is required.`,
          );
        }
      }
    }
    root = path.join(root, dir, pathSep);
  }
};

FileSystemAdapter.prototype._splitFilename = memoizeStringOnly(function(
  filename,
) {
  const indexOfLastDot = filename.lastIndexOf('.');
  const nameWithoutExt =
    indexOfLastDot !== -1 ? filename.substring(0, indexOfLastDot) : filename;
  const ext =
    indexOfLastDot !== -1 ? filename.substring(indexOfLastDot + 1) : null;

  let index = nameWithoutExt.lastIndexOf('@');
  if (index !== -1) {
    let name = nameWithoutExt.substring(0, index);

    // get id and category
    let rest = nameWithoutExt.substring(index + 1);
    let index2 = rest.lastIndexOf('~');

    return {
      ext,
      name: name + (ext ? '.' + ext : ''),
      category:
        index2 !== -1 ? this._getCategoryName(rest.substring(index2 + 1)) : null,
      id: rest.substring(0, index2),
    };
  }
});

FileSystemAdapter.prototype._getCategoryName = memoizeStringOnly(function(
  category,
) {
  if (category) {
    const index = categories.findIndex(other => other.slug === category);
    return index !== -1 ? categories[index].displayName : null;
  }
});

module.exports = FileSystemAdapter;
module.exports.default = FileSystemAdapter;
