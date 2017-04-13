/**
 *
 * @flow
 */

import cookie from 'react-cookie';

import { SECURE } from 'vars';

export default /* StorageController = */ {
  async: 0,

  getItem(path: string): ?string {
    return cookie.load(path, /* doNotParse = */true);
  },

  setItem(path: string, value: string) {
    try {
      cookie.save(path, value, { path: '/', httpOnly: false, secure: SECURE });
    } catch (e) {
      // Quota exceeded, possibly due to Safari Private Browsing mode
    }
  },

  removeItem(path: string) {
    cookie.remove(path);
  },

  clear() {
  },
};

