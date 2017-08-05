import keyOf from 'keyOf';

export const RESEND_EMAIL_VERIFICATION = keyOf({
  RESEND_EMAIL_VERIFICATION: null,
});
export const SIGN_UP = keyOf({ SIGN_UP: null });
export const PASSWORD_RESET = keyOf({ PASSWORD_RESET: null });
export const UPDATE_ACCOUNT_SETTINGS = keyOf({ UPDATE_ACCOUNT_SETTINGS: null });
export const SET_PASSWORD = keyOf({ SET_PASSWORD: null });
export const UPDATE_USER_BUSINESS = keyOf({ UPDATE_USER_BUSINESS: null });
export const CHANGE_EMAIL = keyOf({ CHANGE_EMAIL: null });

export const AUTHORIZE_MANAGER = keyOf({ AUTHORIZE_MANAGER: null });
export const REVOKE_MANAGER_AUTHORIZATION = keyOf({
  REVOKE_MANAGER_AUTHORIZATION: null,
});

export const PURGE_DOC = keyOf({ PURGE_DOC: null });

export const ADD_DOC = keyOf({ ADD_DOC: null });
export const DELETE_DOC = keyOf({ DELETE_DOC: null });
export const RESTORE_DOC = keyOf({ RESTORE_DOC: null });
export const SET_MANAGER = keyOf({ SET_MANAGER: null });
export const SET_STATE = keyOf({ SET_STATE: null });
export const CLOSE_DOC = keyOf({ CLOSE_DOC: null });
export const CANCEL_DOC = keyOf({ CANCEL_DOC: null });

export const UPLOAD_FILE = keyOf({ UPLOAD_FILE: null });
export const DELETE_FILE = keyOf({ DELETE_FILE: null });
export const RESTORE_FILE = keyOf({ RESTORE_FILE: null });

// Payments
export const SET_PAY = keyOf({ SET_PAY: null });
export const DEL_PAY = keyOf({ DEL_PAY: null });

// Nature
export const SET_NATURE = keyOf({ SET_NATURE: null });
export const DEL_NATURE = keyOf({ DEL_NATURE: null });

// Police
export const SET_POLICE = keyOf({ SET_POLICE: null });
export const DEL_POLICE = keyOf({ DEL_POLICE: null });

// Validation
export const SET_DT_VALIDATION = keyOf({ SET_DT_VALIDATION: null });
export const DEL_DT_VALIDATION = keyOf({ DEL_DT_VALIDATION: null });

export const DEL_MT_RAPPORTS = keyOf({ DEL_MT_RAPPORTS: null });
export const SET_MT_RAPPORTS = keyOf({ SET_MT_RAPPORTS: null });

export const DOC_ID_KEY = 'refNo';
export const DOC_FOREIGN_KEY = 'ref';
