/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path');
const debug = require('debug')('app:config');
const ip = require('ip');
const objectAssign = require('object-assign');

const babelOptions = require('../../scripts/getBabelOptions')({
  moduleMap: {
    'messages'         : 'common/messages',
    'getCurrentUser'   : 'common/getCurrentUser',
    'environment'      : 'common/environment',
    'dataIdFromObject' : 'common/dataIdFromObject',
  },
  plugins: [
    'transform-runtime',
    'transform-export-extensions',
    ['react-intl', {
      messagesDir: path.resolve(process.cwd(), 'build', 'intl-messages'),
      enforceDescriptions: false
    }],
  ],
});

debug('Creating default configuration.')
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Site info
  // ----------------------------------
  title : process.env.SITE_TITLE,

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : process.cwd(),
  dir_client : 'js',
  dir_dist   : 'dist',
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

  // ----------------------------------
  // graphql config
  // ----------------------------------
  graphql_endpoint  : process.env.GRAPHQL_ENDPOINT || '/graphql',
  graphiql_endpoint : process.env.GRAPHIQL_ENDPOINT || '/graphiql',
  graphiql_pretty   : true,

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
        plugins: [ 'transform-react-jsx-source' ],
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
    colors : true
  },
  compiler_vendors : [
    'react',
    'react-redux',
    'react-router',
    'redux'
  ],
  compiler_offline_assets : [

  ]
}

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
    NODE_ENV           : JSON.stringify(config.env),

    APPLICATION_ID     : JSON.stringify(process.env.APPLICATION_ID),
    JAVASCRIPT_KEY     : JSON.stringify(process.env.JAVASCRIPT_KEY),
    MASTER_KEY         : JSON.stringify(process.env.MASTER_KEY),

    SERVER_URL         : JSON.stringify(config.parse_server_url || `http://${config.server_host}:${config.server_port}${config.parse_server_mount_point}`),
    GRAPHQL_ENDPOINT   : JSON.stringify(config.graphql_endpoint),

    PARSE_MODULE_PATH  : JSON.stringify('parse'),


    ENV                : JSON.stringify('client'),
    BASENAME           : JSON.stringify(process.env.BASENAME || ''),
    SITE_TITLE         : JSON.stringify(process.env.SITE_TITLE),
  },
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../../package.json')

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/build/config/index.js`
    )
  })

// ------------------------------------
// Utilities
// ------------------------------------
function base () {
  const args = [config.path_base].concat([].slice.call(arguments))
  return path.resolve.apply(path, args)
}

config.utils_paths = {
  base   : base,
  client : base.bind(null, config.dir_client),
  dist   : base.bind(null, config.dir_dist)
}

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`);
const environments = require('./environments');
const overrides = environments[config.env];
if (overrides) {
  debug('Found overrides, applying to default configuration.')
  objectAssign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}

module.exports = config;
