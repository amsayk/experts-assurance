import Parse from 'parse';

import {
  APPLICATION_ID,
  JAVASCRIPT_KEY,
  MASTER_KEY,
  SERVER_URL,
} from 'vars';

import CookieStorageController from 'utils/StorageController.cookie';

Parse.initialize(
  APPLICATION_ID,
  JAVASCRIPT_KEY,
  MASTER_KEY
);

Parse.CoreManager.setStorageController(
  CookieStorageController
);

Parse.CoreManager.set(
  'REQUEST_ATTEMPT_LIMIT', 0
);

Parse.serverURL = SERVER_URL;

