import { createWorker } from 'redux-worker';
import { XLSX_TO_DOCS } from 'redux/reducers/importation/constants';

import { APP_NAME } from 'vars';

import X from 'xlsx';

let worker = createWorker();

worker.registerTask(XLSX_TO_DOCS, function({ data, isBinary }) {
  try {
    const workbook = X.read(data, { type: isBinary ? 'binary' : 'base64' });
    return to_json(workbook);
  } catch (e) {
    return { error: e };
  }

  function to_json(workbook) {
    const result = [];
    workbook.SheetNames.forEach(function(sheetName) {
      const roa = X.utils.sheet_to_json(workbook.Sheets[sheetName]);
      if (roa.length > 0) {
        roa.forEach(o => result.push(cleanDoc(o)));
      }
    });
    return result;

    function cleanDoc(o) {
      return Object.keys(o).reduce(function(memo, key) {
        const newKey = key.trim().split(/\s+/).join(' ');
        memo[newKey] = o[key];
        return memo;
      }, {});
    }
  }
});
