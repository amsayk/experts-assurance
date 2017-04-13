import keyOf from 'keyOf';

import ExecutionEnvironment from 'ExecutionEnvironment';

// Use this constant to initialize reducers
export const INIT                             = keyOf({ INIT: null });

export const SERVER                           = !ExecutionEnvironment.canUseDOM;

export const PUBLIC                           = typeof process.env.PUBLIC === 'string' ? process.env.PUBLIC === 'true' : process.env.PUBLIC; // will be string on server-side

export const APP_NAME                         = process.env.APP_NAME;
export const COUNTRY                          = process.env.COUNTRY;
export const BUSINESS_KEY                     = process.env.BUSINESS_KEY;
export const INACTIVITY_TIMEOUT               = 15 * 60 * 1000; // 15 minutes

export const DEFAULT_LANG                     = process.env.DEFAULT_LANG;

export const GRAPHQL_SUBSCRIPTIONS_ENDPOINT   = process.env.GRAPHQL_SUBSCRIPTIONS_ENDPOINT;
export const GRAPHQL_ENDPOINT                 = process.env.GRAPHQL_ENDPOINT;
export const APOLLO_QUERY_BATCH_INTERVAL      = process.env.APOLLO_QUERY_BATCH_INTERVAL;
export const PERSISTED_QUERIES                = process.env.PERSISTED_QUERIES; // used only on client-side

export const ENABLE_RECAPTCHA                 = typeof process.env.ENABLE_RECAPTCHA === 'string' ? process.env.ENABLE_RECAPTCHA === 'true' : process.env.ENABLE_RECAPTCHA; // will be string on server-side
export const RECAPCHA_JS_URL                  = process.env.RECAPCHA_JS_URL;
export const RECAPCHA_SITE_KEY                = process.env.RECAPCHA_SITE_KEY;

export const APPLICATION_ID                   = process.env.APPLICATION_ID;
export const JAVASCRIPT_KEY                   = process.env.JAVASCRIPT_KEY;
export const SERVER_URL                       = process.env.SERVER_URL;

export const BASENAME                         = process.env.BASENAME;

export const PASSWORD_MIN_LENGTH              = process.env.PASSWORD_MIN_LENGTH;
export const PASSWORD_MIN_SCORE               = process.env.PASSWORD_MIN_SCORE;

export const PATH_LOGIN                       = process.env.PATH_LOGIN;
export const PATH_SIGNUP                      = process.env.PATH_SIGNUP;
export const PATH_PASSWORD_RESET              = process.env.PATH_PASSWORD_RESET;
export const PATH_CHOOSE_PASSWORD             = process.env.PATH_CHOOSE_PASSWORD;
export const PATH_EMAIL_VERIFICATION_SUCCESS  = process.env.PATH_EMAIL_VERIFICATION_SUCCESS;
export const PATH_PASSWORD_RESET_SUCCESS      = process.env.PATH_PASSWORD_RESET_SUCCESS;
export const PATH_INVALID_LINK                = process.env.PATH_INVALID_LINK;
export const PATH_ACTIVATION                  = process.env.PATH_ACTIVATION;

// Dashboard
export const PATH_DASHBOARD                   = process.env.PATH_DASHBOARD;

// Cases
export const PATH_CASES                       = process.env.PATH_CASES;
export const PATH_CASES_CASE                  = process.env.PATH_CASES_CASE;
export const PATH_CASES_CASE_PARAM            = process.env.PATH_CASES_CASE_PARAM;

// Settings
export const PATH_SETTINGS_BASE                 = process.env.PATH_SETTINGS_BASE;
export const PATH_SETTINGS_ACCOUNT              = process.env.PATH_SETTINGS_ACCOUNT;
export const PATH_SETTINGS_CHANGE_PASSWORD      = process.env.PATH_SETTINGS_CHANGE_PASSWORD;
export const PATH_SETTINGS_BUSINESS_DETAILS     = process.env.PATH_SETTINGS_BUSINESS_DETAILS;
export const PATH_SETTINGS_CHANGE_EMAIL         = process.env.PATH_SETTINGS_CHANGE_EMAIL;
export const PATH_SETTINGS_BUSINESS_USERS       = process.env.PATH_SETTINGS_BUSINESS_USERS;
export const PATH_SETTINGS_BUSINESS_USER        = process.env.PATH_SETTINGS_BUSINESS_USER;
export const PATH_SETTINGS_BUSINESS_USER_PARAM  = process.env.PATH_SETTINGS_BUSINESS_USER_PARAM;

// Search
export const PATH_SEARCH                      = process.env.PATH_SEARCH;

export const SSR                              = process.env.SSR; // only used on client-side. Defined in webpack.config

export const LINK_TERMS_OF_SERVICE            = process.env.LINK_TERMS_OF_SERVICE;
export const LINK_PRIVACY_POLICY              = process.env.LINK_PRIVACY_POLICY;
export const LINK_SUPPORT                     = process.env.LINK_SUPPORT;

export const APOLLO_DEFAULT_REDUX_ROOT_KEY    = 'apollo';

export const SECURE                           = typeof process.env.SECURE === 'string' ? process.env.SECURE === 'true' : process.env.SECURE; // will be string on server-side

