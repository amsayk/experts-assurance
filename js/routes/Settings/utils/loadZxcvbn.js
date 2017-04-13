import { SERVER } from 'vars';

import emptyFunction from 'emptyFunction';

export default SERVER ? emptyFunction.thatReturns(() => ({ score: 0 })) : function loadZxcvbn() {
  return new Promise((resolve) => {
    require.ensure([], (require) => {
      const zxcvbn = require('zxcvbn');
      resolve(zxcvbn);
    }, 'zxcvbn');
  });
};

