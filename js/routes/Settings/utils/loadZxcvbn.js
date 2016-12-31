export default function loadZxcvbn() {
  return new Promise((resolve) => {
    require.ensure([], (require) => {
      const zxcvbn = require('zxcvbn');
      resolve(zxcvbn);
    }, 'zxcvbn');
  });
}

