import Parse from 'parse';

import CookieStorageController from 'utils/StorageController.cookie';

Parse.initialize(
  process.env.APPLICATION_ID,
  process.env.JAVASCRIPT_KEY,
  process.env.MASTER_KEY
);

Parse.CoreManager.setStorageController(
  CookieStorageController
);

Parse.CoreManager.set(
  'REQUEST_ATTEMPT_LIMIT', 0
);

Parse.serverURL = process.env.SERVER_URL;

