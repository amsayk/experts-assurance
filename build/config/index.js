/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path');
const log = require('log')('app:config');
const objectAssign = require('object-assign');
const nullthrows = require('nullthrows');

const kue = require('kue');
const Redis = require('ioredis');

const moduleMap = {
  'loadScript'                         : 'utils/loadScript',
  'validation'                         : 'common/validation',
  'validation-messages'                : 'common/messages/validation-messages',
  'getCurrentUser'                     : 'common/getCurrentUser',
  'vars'                               : 'common/vars',
  'roles'                              : 'common/roles',
  'dataIdFromObject'                   : 'common/dataIdFromObject',
  'log'                                : 'common/log',
  'slug'                               : 'common/slug',
  'NetInfo'                            : 'utils/NetInfo',
  'AppState'                           : 'utils/AppState',
  'countries'                          : 'common/countries',
  'authWrappers/UserIsAuthenticated'   : 'utils/auth/authWrappers/UserIsAuthenticated',
  'authWrappers/NotAuthenticated'      : 'utils/auth/authWrappers/NotAuthenticated',
};

const babelOptions = require('scripts/getBabelOptions')({
  plugins: [
    ['transform-runtime', {
      polyfill: false,
      regenerator: false,
    }],
    'transform-export-extensions',
    ['react-intl', {
      messagesDir: path.resolve(process.cwd(), 'build', 'intl', 'messages'),
      enforceDescriptions: false,
    }],
  ],
});

log('Creating default configuration.');
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : process.env.NODE_ENV || 'development',

  // HTTPS
  secure : process.env.IS_SECURE === 'yes',

  // Cluster
  get clusterSize() {
    return require('os').cpus().length;
  },

  // SSR
  ssrEnabled : process.env.NODE_ENV === 'production' || (process.env.SSR_DEV === 'yes'),

  // ----------------------------------
  // Site info
  // ----------------------------------
  businessKey : nullthrows(process.env.BUSINESS_KEY),
  appName     : nullthrows(process.env.APP_NAME),
  country     : nullthrows(process.env.COUNTRY),

  // Locales
  supportedLangs : ['fr'],
  lang           : 'fr',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : process.cwd(),
  dir_client : 'js',
  dir_dist   : 'dist',
  dir_public : 'public',
  dir_server : 'server',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : process.env.HOST || 'localhost', // use string 'localhost' to prevent exposure on local network
  server_port : process.env.PORT || '5000',

  // ----------------------------------
  // Parse config
  // ----------------------------------
  parse_server_mount_point    : process.env.PARSE_MOUNT || '/parse',
  parse_server_url            : process.env.SERVER_URL,
  parse_database_uri          : process.env.DATABASE_URI,
  parse_dashboard_mount_point : process.env.PARSE_DASHBOARD_MOUNT || '/dashboard',

  // App config
  verifyUserEmails                  : process.env.VERIFY_USER_EMAILS === 'yes',

  path_login                        : process.env.PATH_LOGIN || '/login',
  path_signup                       : process.env.PATH_SIGNUP || '/signup',
  path_password_reset               : process.env.PATH_PASSWORD_RESET || '/password_reset',
  path_choose_password              : process.env.PATH_CHOOSE_PASSWORD || '/choose_password',
  path_email_verification_success   : process.env.PATH_EMAIL_VERIFICATION_SUCCESS || '/verify_email_success',
  path_password_reset_success       : process.env.PATH_PASSWORD_RESET_SUCCESS || '/password_reset_success',
  path_invalid_link                 : process.env.PATH_INVALID_LINK || '/invalid_link',
  path_activation                   : process.env.PATH_ACTIVATION || '/activation',

  // cases
  path_cases                        : process.env.PATH_CASES || '/cases',
  path_cases_case                   : process.env.PATH_CASES_CASE || '/case',
  path_cases_case_param             : process.env.PATH_CASES_CASE_PARAM || 'id',

  // settings
  path_settings_base                : process.env.PATH_SETTINGS_BASE || '/settings',
  path_settings_account             : process.env.PATH_SETTINGS_ACCOUNT || 'account',
  path_settings_change_password     : process.env.PATH_SETTINGS_CHANGE_PASSWORD || 'change_password',
  path_settings_business_details    : process.env.PATH_SETTINGS_BUSINESS_DETAILS || 'business',
  path_settings_business_users      : process.env.PATH_SETTINGS_BUSINESS_USERS || 'users',
  path_settings_business_user       : process.env.PATH_SETTINGS_BUSINESS_USER || 'user',
  path_settings_business_user_param : process.env.PATH_SETTINGS_BUSINESS_USER_PARAM || 'id',
  path_settings_change_email        : process.env.PATH_SETTINGS_CHANGE_EMAIL || 'change_email',

  // search
  path_search                      : process.env.PATH_SEARCH || '/search',

  password_min_length : nullthrows(process.env.PASSWORD_MIN_LENGTH && parseInt(process.env.PASSWORD_MIN_LENGTH, 10)),
  password_min_score  : nullthrows(process.env.PASSWORD_MIN_SCORE && parseInt(process.env.PASSWORD_MIN_SCORE, 10)),

  // ----------------------------------
  // Mailgun settings
  // ----------------------------------
  mailgun_api_key       : nullthrows(process.env.MAILGUN_API_KEY),
  mailgun_domain        : nullthrows(process.env.MAILGUN_DOMAIN),
  mailgun_from_address  : nullthrows(process.env.MAILGUN_FROM_ADDRESS),

  // ----------------------------------
  // graphql config
  // ----------------------------------
  graphql_endpoint  : process.env.GRAPHQL_ENDPOINT || '/graphql',
  graphql_subscriptions_endpoint : process.env.GRAPHQL_SUBSCRIPTIONS_ENDPOINT || '/ws',
  graphiql_endpoint : process.env.GRAPHIQL_ENDPOINT || '/graphiql',
  persistedQueries  : process.env.PERSISTED_QUERIES !== 'no',

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel_options_module_map : moduleMap,
  compiler_babel_query : {
    babelrc        : false,
    cacheDirectory : false,
  },
  compiler_babel_options : objectAssign({}, babelOptions, {
    comments: false,
    compact: true,
    babelrc: false,
    env: {
      development: {
        plugins: ['transform-react-jsx-source'],
      },
      production: {
        minified: true,
        plugins: [
          'transform-react-remove-prop-types',
          'transform-react-constant-elements',
          // 'transform-react-inline-elements',
          'transform-react-router-optimize',
        ],
      },
    },
    retainLines: true,
  }),
  compiler_devtool         : 'source-map',
  compiler_hash_type       : 'contenthash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '/',
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true,
    modules: false,
  },
  compiler_vendors : [
    'parse',
    'react',
    'react-redux',
    'react-router',
    'redux',
    'react-apollo',
    'apollo-client',
    'redux-immutable',
    'classnames',
    'moment',
  ],
  compiler_offline_assets : [

  ],
};

// ------------------------------------
// Kue global queue
// ------------------------------------

config.kue_opts = {
  prefix : config.businessKey,
  redis  : {
    createClientFactory: function () {
      return new Redis();
    }
  },
  disableSearch: true,
};

Object.defineProperty(config, 'queue', {
  get: function () {
    if (!global.__queue) {
      log('Creating queue');
      global.__queue = kue.createQueue(config.kue_opts);
    }

    return global.__queue;
  },
});

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
 ************************************************/

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env'  : {
    NODE_ENV              : JSON.stringify(config.env),

    APPLICATION_ID        : JSON.stringify(process.env.APPLICATION_ID),
    JAVASCRIPT_KEY        : JSON.stringify(process.env.JAVASCRIPT_KEY),

    SERVER_URL : JSON.stringify(config.parse_server_url || `${config.secure ? 'https' : 'http'}://${config.server_host}${config.secure ? '' : ':' + config.server_port}${config.parse_server_mount_point}`), // eslint-disable-line max-len

    GRAPHQL_ENDPOINT                : JSON.stringify(config.graphql_endpoint),
    GRAPHQL_SUBSCRIPTIONS_ENDPOINT  : JSON.stringify(`${config.secure ? 'wss' : 'ws'}://${config.server_host}:${config.secure ? '' : config.server_port}${config.graphql_subscriptions_endpoint}`),
    PERSISTED_QUERIES               : JSON.stringify(config.persistedQueries),

    BASENAME              : JSON.stringify(process.env.BASENAME || ''),

    // Default lang
    DEFAULT_LANG          : JSON.stringify(config.lang),

    PATH_LOGIN                        : JSON.stringify(config.path_login),
    PATH_SIGNUP                       : JSON.stringify(config.path_signup),
    PATH_PASSWORD_RESET               : JSON.stringify(config.path_password_reset),
    PATH_CHOOSE_PASSWORD              : JSON.stringify(config.path_choose_password),
    PATH_EMAIL_VERIFICATION_SUCCESS   : JSON.stringify(config.path_email_verification_success),
    PATH_PASSWORD_RESET_SUCCESS       : JSON.stringify(config.path_password_reset_success),
    PATH_INVALID_LINK                 : JSON.stringify(config.path_invalid_link),
    PATH_ACTIVATION                   : JSON.stringify(config.path_activation),

    // Cases
    PATH_CASES                        : JSON.stringify(config.path_cases),
    PATH_CASES_CASE                   : JSON.stringify(config.path_cases_case),
    PATH_CASES_CASE_PARAM             : JSON.stringify(config.path_cases_case_param),

    // Settings
    PATH_SETTINGS_BASE                : JSON.stringify(config.path_settings_base),
    PATH_SETTINGS_ACCOUNT             : JSON.stringify(config.path_settings_account),
    PATH_SETTINGS_CHANGE_PASSWORD     : JSON.stringify(config.path_settings_change_password),
    PATH_SETTINGS_BUSINESS_DETAILS    : JSON.stringify(config.path_settings_business_details),
    PATH_SETTINGS_BUSINESS_USERS      : JSON.stringify(config.path_settings_business_users),
    PATH_SETTINGS_BUSINESS_USER       : JSON.stringify(config.path_settings_business_user),
    PATH_SETTINGS_BUSINESS_USER_PARAM : JSON.stringify(config.path_settings_business_user_param),
    PATH_SETTINGS_CHANGE_EMAIL        : JSON.stringify(config.path_settings_change_email),

    // Search
    PATH_SEARCH           : JSON.stringify(config.path_search),

    ENABLE_RECAPTCHA      : JSON.stringify(process.env.ENABLE_RECAPTCHA === 'yes'),
    PASSWORD_MIN_LENGTH   : JSON.stringify(config.password_min_length),
    PASSWORD_MIN_SCORE    : JSON.stringify(config.password_min_score),

    RECAPCHA_SITE_KEY     : JSON.stringify(process.env.RECAPCHA_SITE_KEY),
    RECAPCHA_JS_URL       : JSON.stringify(process.env.RECAPCHA_JS_URL),

    APP_NAME              : JSON.stringify(config.appName),

    COUNTRY               : JSON.stringify(config.country),

    BUSINESS_KEY          : JSON.stringify(config.businessKey),

    DEV_PASSWORD          : JSON.stringify(process.env.DEV_PASSWORD),

    LINK_TERMS_OF_SERVICE : JSON.stringify(process.env.LINK_TERMS_OF_SERVICE || 'https://www.epsilon.ma/legal/privacy-policy'),
    LINK_PRIVACY_POLICY   : JSON.stringify(process.env.PRIVACY_POLICY || 'https://www.epsilon.ma/legal/customer-agreement'),
    LINK_SUPPORT          : JSON.stringify(process.env.SUPPORT || 'https://support.espilon.ma'),
  },
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('package.json');

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) {return true;}

    log(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/build/config/index.js`
    );
    return false;
  });

// ------------------------------------
// Utilities
// ------------------------------------
function base() {
  const args = [config.path_base].concat([].slice.call(arguments));
  return path.resolve.apply(path, args);
}

config.utils_paths = {
  base   : base,
  client : base.bind(null, config.dir_client),
  server : base.bind(null, config.dir_server),
  public : base.bind(null, config.dir_public),
  dist   : base.bind(null, config.dir_dist),
};

// ========================================================
// Environment Configuration
// ========================================================
log(`Looking for environment overrides for NODE_ENV "${config.env}".`);
const environments = require('./environments');
const overrides = environments[config.env];
if (overrides) {
  log('Found overrides, applying to default configuration.');
  objectAssign(config, overrides(config));
} else {
  log('No environment overrides found, defaults will be used.');
}

module.exports = config;

