/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path');
const debug = require('debug')('app:config');
const ip = require('ip');
const objectAssign = require('object-assign');
const nullthrows = require('nullthrows');

const babelOptions = require('../../scripts/getBabelOptions')({
  moduleMap: {
    'loadScript'            : 'utils/loadScript',
    'validation'            : 'common/validation',
    'validation-messages'   : 'common/messages/validation-messages',
    'getCurrentUser'        : 'common/getCurrentUser',
    'env'                   : 'common/env',
    'dataIdFromObject'      : 'common/dataIdFromObject',
  },
  plugins: [
    'transform-runtime',
    'transform-export-extensions',
    ['react-intl', {
      messagesDir: path.resolve(process.cwd(), 'build', 'intl', 'messages'),
      enforceDescriptions: false,
    }],
  ],
});

debug('Creating default configuration.');
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Site info
  // ----------------------------------
  appName : 'Trading',
  title   : process.env.HOME_TITLE,

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
  server_host : ip.address(), // use string 'localhost' to prevent exposure on local network
  server_port : process.env.PORT || 5000,

  // ----------------------------------
  // Parse config
  // ----------------------------------
  parse_server_mount_point    : process.env.PARSE_MOUNT || '/parse',
  parse_server_url            : process.env.SERVER_URL,
  parse_database_uri          : process.env.DATABASE_URI,
  parse_dashboard_mount_point : process.env.PARSE_DASHBOARD_MOUNT || '/dashboard',

  // App config
  path_login                        : process.env.PATH_LOGIN || '/login',
  path_signup                       : process.env.PATH_SIGNUP || '/signup',
  path_password_reset               : process.env.PATH_PASSWORD_RESET || '/password_reset',
  path_choose_password              : process.env.PATH_CHOOSE_PASSWORD || '/choose_password',
  path_email_verification_success   : process.env.PATH_EMAIL_VERIFICATION_SUCCESS || '/verify_email_success',
  path_password_reset_success       : process.env.PATH_PASSWORD_RESET_SUCCESS || '/password_reset_success',
  path_invalid_link                 : process.env.PATH_INVALID_LINK || '/invalid_link',

  password_min_length : nullthrows(process.env.PASSWORD_MIN_LENGTH && parseInt(process.env.PASSWORD_MIN_LENGTH, 10)),

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
  graphiql_endpoint : process.env.GRAPHIQL_ENDPOINT || '/graphiql',

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel_query : {
    cacheDirectory : true,
  },
  compiler_babel_options : objectAssign({}, babelOptions, {
    comments: false,
    compact: true,
    env: {
      development: {
        plugins: ['transform-react-jsx-source'],
      },
    },
    retainLines: true,
  }),
  compiler_devtool         : 'source-map',
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '/',
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true,
  },
  compiler_vendors : [
    'react',
    'react-redux',
    'react-router',
    'redux',
  ],
  compiler_offline_assets : [

  ],
};

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
    MASTER_KEY            : JSON.stringify(process.env.MASTER_KEY),

    SERVER_URL            : JSON.stringify(config.parse_server_url || `http://${config.server_host}:${config.server_port}${config.parse_server_mount_point}`), // eslint-disable-line max-len
    GRAPHQL_ENDPOINT      : JSON.stringify(config.graphql_endpoint),

    PARSE_MODULE_PATH     : JSON.stringify('parse'),


    _ENV                  : JSON.stringify('client'),
    BASENAME              : JSON.stringify(process.env.BASENAME || ''),
    HOME_TITLE            : JSON.stringify(process.env.HOME_TITLE),

    PATH_LOGIN                        : JSON.stringify(config.path_login),
    PATH_SIGNUP                       : JSON.stringify(config.path_signup),
    PATH_PASSWORD_RESET               : JSON.stringify(config.path_password_reset),
    PATH_CHOOSE_PASSWORD              : JSON.stringify(config.path_choose_password),
    PATH_EMAIL_VERIFICATION_SUCCESS   : JSON.stringify(config.path_email_verification_success),
    PATH_PASSWORD_RESET_SUCCESS       : JSON.stringify(config.path_password_reset_success),
    PATH_INVALID_LINK                 : JSON.stringify(config.path_invalid_link),

    PASSWORD_MIN_LENGTH   : JSON.stringify(config.password_min_length),

    RECAPCHA_SITE_KEY     : JSON.stringify(process.env.RECAPCHA_SITE_KEY),
    RECAPCHA_JS_URL       : JSON.stringify(process.env.RECAPCHA_JS_URL),

    APP_NAME              : JSON.stringify(config.appName),

    DEV_PASSWORD          : JSON.stringify(process.env.DEV_PASSWORD),
  },
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../../package.json');

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) {return true;}

    debug(
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
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`);
const environments = require('./environments');
const overrides = environments[config.env];
if (overrides) {
  debug('Found overrides, applying to default configuration.');
  objectAssign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}

module.exports = config;
