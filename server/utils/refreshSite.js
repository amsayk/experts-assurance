import cookie from 'react-cookie';

import { VERSION, SECURE } from 'vars';

const KEY = '@@VERSION';

function clearListCookies() {
  const cookies = cookie.select(/.*/);
  Object.keys(cookies).forEach(key => {
    cookie.remove(key);
  });
}

export default function refreshSite() {
  const currentVersion = cookie.load(KEY, /* doNotParse = */ true);
  if (currentVersion !== VERSION) {
    clearListCookies();
    cookie.save(KEY, VERSION, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: false,
      secure: SECURE,
    });
  }
}
