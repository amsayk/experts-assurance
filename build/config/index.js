/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path');
const log = require('log')('app:config');
const objectAssign = require('object-assign');
const nullthrows = require('nullthrows');

const { loadAdapter } = require('parse-server/lib/Adapters/AdapterLoader');

const kue = require('kue');
const Redis = require('ioredis');

const moduleMap = {
  loadScript: 'utils/loadScript',
  validation: 'common/validation',
  'validation-messages': 'common/messages/validation-messages',
  getCurrentUser: 'common/getCurrentUser',
  vars: 'common/vars',
  roles: 'common/roles',
  dataIdFromObject: 'common/dataIdFromObject',
  getDataTransferItems: 'common/getDataTransferItems',
  delay: 'common/delay',
  log: 'common/log',
  slug: 'common/slug',
  NetInfo: 'utils/NetInfo',
  AppState: 'utils/AppState',
  Clipboard: 'utils/Clipboard',
  countries: 'common/countries',
  'authWrappers/UserIsAuthenticated':
    'utils/auth/authWrappers/UserIsAuthenticated',
  'authWrappers/NotAuthenticated': 'utils/auth/authWrappers/NotAuthenticated',

  // cookie storage
  'StorageController.cookie': 'common/utils/StorageController.cookie',

  'result-codes': 'common/result-codes',
  'intl-formats': 'common/intl-formats',
  'file-categories': 'common/file-categories',

  printDocRef: 'common/printDocRef',
};

const babelOptions = require('scripts/getBabelOptions')({
  plugins: [
    'dynamic-import-webpack',
    [
      'transform-runtime',
      {
        polyfill: false,
        regenerator: false,
      },
    ],
    'transform-export-extensions',
    [
      'react-intl',
      {
        messagesDir: path.resolve(process.cwd(), 'build', 'intl', 'messages'),
        enforceDescriptions: false,
      },
    ],
  ],
});

log('Creating default configuration.');
// ========================================================
// Default Configuration
// ========================================================
const config = {
  verbose: false,

  // Allow debugging in prodiction mode
  debug: typeof process.env.DEBUG !== 'undefined' ? process.env.DEBUG : null,

  env: process.env.NODE_ENV || 'development',

  // HTTPS
  secure:
    process.env.NODE_ENV === 'production' && process.env.IS_SECURE === 'yes',

  // Cluster
  get clusterWorkerSize() {
    return require('os').cpus().length;
  },

  // SSR
  ssrEnabled:
    process.env.NODE_ENV === 'production' || process.env.SSR_DEV === 'yes',

  // Public access
  public: nullthrows(process.env.PUBLIC_SITE) === 'yes',

  // ----------------------------------
  // Site info
  // ----------------------------------
  businessKey: nullthrows(process.env.BUSINESS_KEY),
  appName: nullthrows(process.env.APP_NAME),
  country: nullthrows(process.env.COUNTRY),

  // Locales
  supportedLangs: ['fr', 'en'],
  get lang() {
    return typeof process.env.DEFAULT_LANG !== 'undefined' &&
    this.supportedLangs.indexOf(process.env.DEFAULT_LANG) !== -1
      ? process.env.DEFAULT_LANG
      : 'fr';
  },

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: process.cwd(),
  dir_client: 'js',
  dir_dist: 'dist',
  dir_public: 'public',
  dir_server: 'server',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: process.env.HOST || 'localhost', // use string 'localhost' to prevent exposure on local network
  server_port: process.env.PORT || '5000',

  // ----------------------------------
  // Parse config
  // ----------------------------------
  parse_server_mount_point: process.env.PARSE_MOUNT || '/parse',
  parse_server_url: process.env.SERVER_URL,
  parse_public_server_url:
    process.env.PUBLIC_SERVER_URL || process.env.SERVER_URL,
  get parse_database_uri() {
    if (typeof this._databaseUri === 'undefined') {
      this._databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;
      if (!this._databaseUri) {
        log('DATABASE_URI not specified, falling back to localhost.');
      }
    }
    return this._databaseUri;
  },
  parse_dashboard_mount_point:
    process.env.PARSE_DASHBOARD_MOUNT || '/parse-dashboard',

  // Elasticsearch config
  get esIndex() {
    return String(this.appName + '-' + this.businessKey).toLowerCase();
  },
  elasticsearch_host_1: process.env.ES_HOST || 'localhost:9200',

  // Uploads
  get uploadOptions() {
    return {};
  },

  // Recaptcha
  get recaptcha() {
    if (!this._recaptcha) {
      const Recaptcha = require('recaptcha-verify');
      this._recaptcha = new Recaptcha({
        secret: nullthrows(process.env.RECAPCHA_SITE_SECRET),
        verbose: true,
      });
    }
    return this._recaptcha;
  },

  get filesAdapterConfig() {
    return {
      module: require.resolve('parse-server-fs-adapter'),
      options: {
        filesSubDirectory: this.businessKey,
      },
    };
  },

  get filesController() {
    if (!this._filesController) {
      const Parse = require('parse/node');
      // Get access to Parse Server's cache
      const { AppCache } = require('parse-server/lib/cache');
      // Get a reference to the MailgunAdapter
      // NOTE: It's best to do this inside the Parse.Cloud.define(...) method body and not at the top of your file with your other imports. This gives Parse Server time to boot, setup cloud code and the email adapter.
      const app = AppCache.get(Parse.applicationId);
      if (app) {
        this._filesController = app['filesController'];
      } else {
        const filesAdapter = loadAdapter(this.filesAdapterConfig, () => {
          throw new Error('Could not load filesAdapter');
        });
        const {
          FilesController,
        } = require('parse-server/lib/Controllers/FilesController');
        this._filesController = new FilesController(
          filesAdapter,
          Parse.applicationId,
        );
      }
    }

    return this._filesController;
  },

  // mail adapter
  get mailAdapterOptions() {
    if (!this._mailAdapterOptions) {
      this._mailAdapterOptions = {
        fromAddress: this.mailgun_from_address,
        domain: this.mailgun_domain,
        apiKey: this.mailgun_api_key,
        templates: {
          passwordResetEmail: {
            subject: 'Réinitializer votre mot de passe avec ' + this.appName,
            pathPlainText: this.utils_paths.server(
              'email-templates/password_reset_email.txt',
            ),
            callback: user => ({}),
          },
          verificationEmail: {
            subject: 'Vérifier votre adresse e-mail avec ' + this.appName,
            pathPlainText: this.utils_paths.server(
              'email-templates/verification_email.txt',
            ),
            callback: user => ({}),
          },
        },
      };
    }
    return this._mailAdapterOptions;
  },
  get mailAdapterConfig() {
    return {
      module: require.resolve('backend/mail/MailAdapter'),
      options: this.mailAdapterOptions,
    };
  },
  get mailAdapter() {
    if (!this._mailAdaper) {
      const Parse = require('parse/node');
      const MailAdapter = require('backend/mail/MailAdapter');
      // Get access to Parse Server's cache
      const { AppCache } = require('parse-server/lib/cache');
      // Get a reference to the MailgunAdapter
      // NOTE: It's best to do this inside the Parse.Cloud.define(...) method body and not at the top of your file with your other imports. This gives Parse Server time to boot, setup cloud code and the email adapter.
      const app = AppCache.get(Parse.applicationId);
      if (app) {
        this._mailAdaper = app['userController']['adapter'];
      } else {
        const mailAdapter = loadAdapter(this.mailAdapterConfig, () => {
          throw new Error('Could not load mailAdapter');
        });
        this._mailAdaper = mailAdapter;
      }
    }

    return this._mailAdaper;
  },

  // App config
  verifyUserEmails: process.env.VERIFY_USER_EMAILS !== 'no',

  path_login: process.env.PATH_LOGIN || '/login',
  path_signup: process.env.PATH_SIGNUP || '/signup',
  path_password_reset: process.env.PATH_PASSWORD_RESET || '/password_reset',
  path_choose_password: process.env.PATH_CHOOSE_PASSWORD || '/choose_password',
  path_email_verification_success:
    process.env.PATH_EMAIL_VERIFICATION_SUCCESS || '/verify_email_success',
  path_password_reset_success:
    process.env.PATH_PASSWORD_RESET_SUCCESS || '/password_reset_success',
  path_invalid_link: process.env.PATH_INVALID_LINK || '/invalid_link',
  path_activation: process.env.PATH_ACTIVATION || '/activation',
  path_authorization: process.env.PATH_AUTHORIZATION || '/authorization',

  // dashboard
  path_dashboard: process.env.PATH_DASHBOARD || '/dashboard',

  // cases
  path_cases: process.env.PATH_CASES || '/cases',
  path_cases_case: process.env.PATH_CASES_CASE || '/case',
  path_cases_case_param: process.env.PATH_CASES_CASE_PARAM || 'id',

  // settings
  path_settings_base: process.env.PATH_SETTINGS_BASE || '/settings',
  path_settings_account: process.env.PATH_SETTINGS_ACCOUNT || 'account',
  path_settings_change_password:
    process.env.PATH_SETTINGS_CHANGE_PASSWORD || 'change_password',
  path_settings_business_details:
    process.env.PATH_SETTINGS_BUSINESS_DETAILS || 'business',
  path_settings_business_users:
    process.env.PATH_SETTINGS_BUSINESS_USERS || 'users',
  path_settings_business_user: process.env.PATH_SETTINGS_BUSINESS_USER || 'user',
  path_settings_business_user_param:
    process.env.PATH_SETTINGS_BUSINESS_USER_PARAM || 'id',
  path_settings_change_email:
    process.env.PATH_SETTINGS_CHANGE_EMAIL || 'change_email',

  // search
  path_search: process.env.PATH_SEARCH || '/search',

  password_min_length: nullthrows(
    process.env.PASSWORD_MIN_LENGTH &&
      parseInt(process.env.PASSWORD_MIN_LENGTH, 10),
  ),
  password_min_score: nullthrows(
    process.env.PASSWORD_MIN_SCORE &&
      parseInt(process.env.PASSWORD_MIN_SCORE, 10),
  ),

  // ----------------------------------
  // Mailgun settings
  // ----------------------------------
  mailgun_api_key: nullthrows(process.env.MAILGUN_API_KEY),
  mailgun_domain: nullthrows(process.env.MAILGUN_DOMAIN),
  mailgun_from_address: nullthrows(process.env.MAILGUN_FROM_ADDRESS),

  // ----------------------------------
  // graphql config
  // ----------------------------------
  get queryMap() {
    if (!this._queryMap) {
      const queryMap = require('persisted_queries.json');
      const invert = require('lodash.invert');

      this._queryMap = invert(queryMap);
    }

    return this._queryMap;
  },
  graphql_endpoint: process.env.GRAPHQL_ENDPOINT || '/graphql',
  graphql_subscriptions_endpoint:
    process.env.GRAPHQL_SUBSCRIPTIONS_ENDPOINT || '/subscriptions',
  graphiql_endpoint: process.env.GRAPHIQL_ENDPOINT || '/graphiql',
  persistedQueries: process.env.PERSISTED_QUERIES !== 'no',

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel_options_module_map: moduleMap,
  compiler_babel_query: {
    babelrc: false,
    cacheDirectory: true,
  },
  compiler_babel_options: objectAssign({}, babelOptions, {
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
  compiler_devtool: 'source-map',
  compiler_hash_type: 'contenthash',
  compiler_fail_on_warning: false,
  compiler_quiet: false,
  compiler_public_path: '/',
  compiler_stats: {
    chunks: false,
    chunkModules: false,
    colors: true,
    modules: false,
  },
  compiler_vendors: [
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
  compiler_offline_assets: [],
};

// ------------------------------------
// Kue global queue
// ------------------------------------

config.kue_opts = {
  prefix: config.businessKey,
  redis: {
    createClientFactory: function() {
      return new Redis();
    },
  },
  disableSearch: true,
};

// Lazily create kue
Object.defineProperty(config, 'queue', {
  get: function() {
    if (!global.__queue) {
      log('Creating queue');
      global.__queue = kue.createQueue(config.kue_opts);
      global.__queue.watchStuckJobs();
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
  'process.env': {
    VERSION: 11,

    DEBUG: JSON.stringify(config.debug),

    NODE_ENV: JSON.stringify(config.env),

    PUBLIC: JSON.stringify(config.public),

    APPLICATION_ID: JSON.stringify(process.env.APPLICATION_ID),
    JAVASCRIPT_KEY: JSON.stringify(process.env.JAVASCRIPT_KEY),

    SERVER_URL: JSON.stringify(
      config.parse_server_url ||
        `${config.secure
          ? 'https'
          : 'http'}://${config.server_host}${config.secure
          ? ''
          : ':' + config.server_port}${config.parse_server_mount_point}`,
    ), // eslint-disable-line max-len

    GRAPHQL_ENDPOINT: JSON.stringify(config.graphql_endpoint),
    GRAPHQL_SUBSCRIPTIONS_ENDPOINT: JSON.stringify(
      `${config.secure ? 'wss' : 'ws'}://${config.server_host}:${config.secure
        ? ''
        : config.server_port}${config.graphql_subscriptions_endpoint}`,
    ),

    BASENAME: JSON.stringify(process.env.BASENAME || ''),

    // Default lang
    DEFAULT_LANG: JSON.stringify(config.lang),

    PATH_LOGIN: JSON.stringify(config.path_login),
    PATH_SIGNUP: JSON.stringify(config.path_signup),
    PATH_PASSWORD_RESET: JSON.stringify(config.path_password_reset),
    PATH_CHOOSE_PASSWORD: JSON.stringify(config.path_choose_password),
    PATH_EMAIL_VERIFICATION_SUCCESS: JSON.stringify(
      config.path_email_verification_success,
    ),
    PATH_PASSWORD_RESET_SUCCESS: JSON.stringify(
      config.path_password_reset_success,
    ),
    PATH_INVALID_LINK: JSON.stringify(config.path_invalid_link),
    PATH_ACTIVATION: JSON.stringify(config.path_activation),
    PATH_AUTHORIZATION: JSON.stringify(config.path_authorization),

    // Dasboard
    PATH_DASHBOARD: JSON.stringify(config.path_dashboard),

    // Cases
    PATH_CASES: JSON.stringify(config.path_cases),
    PATH_CASES_CASE: JSON.stringify(config.path_cases_case),
    PATH_CASES_CASE_PARAM: JSON.stringify(config.path_cases_case_param),

    // Settings
    PATH_SETTINGS_BASE: JSON.stringify(config.path_settings_base),
    PATH_SETTINGS_ACCOUNT: JSON.stringify(config.path_settings_account),
    PATH_SETTINGS_CHANGE_PASSWORD: JSON.stringify(
      config.path_settings_change_password,
    ),
    PATH_SETTINGS_BUSINESS_DETAILS: JSON.stringify(
      config.path_settings_business_details,
    ),
    PATH_SETTINGS_BUSINESS_USERS: JSON.stringify(
      config.path_settings_business_users,
    ),
    PATH_SETTINGS_BUSINESS_USER: JSON.stringify(
      config.path_settings_business_user,
    ),
    PATH_SETTINGS_BUSINESS_USER_PARAM: JSON.stringify(
      config.path_settings_business_user_param,
    ),
    PATH_SETTINGS_CHANGE_EMAIL: JSON.stringify(
      config.path_settings_change_email,
    ),

    // Search
    PATH_SEARCH: JSON.stringify(config.path_search),

    PASSWORD_MIN_LENGTH: JSON.stringify(config.password_min_length),
    PASSWORD_MIN_SCORE: JSON.stringify(config.password_min_score),

    ENABLE_RECAPTCHA: JSON.stringify(process.env.ENABLE_RECAPTCHA === 'yes'),
    RECAPCHA_SITE_KEY: JSON.stringify(process.env.RECAPCHA_SITE_KEY),
    RECAPCHA_JS_URL: JSON.stringify(process.env.RECAPCHA_JS_URL),

    APP_NAME: JSON.stringify(config.appName),

    COUNTRY: JSON.stringify(config.country),

    BUSINESS_KEY: JSON.stringify(config.businessKey),

    DEV_PASSWORD: JSON.stringify(process.env.DEV_PASSWORD),

    SECURE: JSON.stringify(config.secure),

    LINK_TERMS_OF_SERVICE: JSON.stringify(
      process.env.LINK_TERMS_OF_SERVICE ||
        'https://www.epsilon.ma/legal/privacy-policy',
    ),
    LINK_PRIVACY_POLICY: JSON.stringify(
      process.env.PRIVACY_POLICY ||
        'https://www.epsilon.ma/legal/customer-agreement',
    ),
    LINK_SUPPORT: JSON.stringify(
      process.env.SUPPORT || 'https://support.espilon.ma',
    ),
  },
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('package.json');

config.compiler_vendors = config.compiler_vendors.filter(dep => {
  if (pkg.dependencies[dep]) {
    return true;
  }

  log(
    `Package '${dep}' was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/build/config/index.js`,
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
  base: base,
  client: base.bind(null, config.dir_client),
  server: base.bind(null, config.dir_server),
  public: base.bind(null, config.dir_public),
  dist: base.bind(null, config.dir_dist),
};

// ========================================================
// Environment Configuration
// ========================================================
log(`Looking for environment overrides for NODE_ENV '${config.env}'.`);
const environments = require('./environments');
const overrides = environments[config.env];
if (overrides) {
  log('Found overrides, applying to default configuration.');
  objectAssign(config, overrides(config));
} else {
  log('No environment overrides found, defaults will be used.');
}

module.exports = config;
