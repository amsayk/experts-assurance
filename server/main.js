import 'isomorphic-fetch';

import kue from 'kue';
import kueUiExpress from 'kue-ui-express';

import getCurrentUser from 'getCurrentUser';

import users from 'data/_User';

import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackConfig from 'build/webpack.config';
import config from 'build/config';
import compress from 'compression';

import cookie from 'react-cookie';
import createLocaleMiddleware from 'express-locale';
import cors from 'cors';

import createSSRRoute from './utils/createSSRRoute';

import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

import schema from 'data/schema';

import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscriptionManager } from 'data/subscriptions';

// Connectors
import { UserConnector } from 'data/user/connector';
import { BusinessConnector } from 'data/business/connector';
import { DocConnector } from 'data/doc/connector';
import { ActivityConnector } from 'data/activity/connector';

// Models
import { Users } from 'data/user/models';
import { Business } from 'data/business/models';
import { Docs } from 'data/doc/models';
import { Activities } from 'data/activity/models';

// persisted queries
import queryMap from 'extracted_queries';
import invert from 'lodash.invert';

import bodyParser from 'body-parser';

const log = require('log')('app:server');

const databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;
if (!databaseUri) {
  log('DATABASE_URI not specified, falling back to localhost.');
}

const app = express();
const paths = config.utils_paths;

// Don't rate limit heroku
app.enable('trust proxy');

// Apply gzip compression
app.use(compress());

// Enable cors support
app.use(cors());

// Setup locale
app.use(createLocaleMiddleware({
  default : `${config.lang}-${config.country}`,
}));

// webpack compiler in devMode
const compiler = config.env === 'development' && webpack(webpackConfig);

// These are the current endpoints
// New endpoints must be added here in order for them to work.
const APP_PATHS = [
  '/',

  config.path_activation,

  config.path_login,
  config.path_signup,
  config.path_choose_password,
  config.path_password_reset,

  config.path_email_verification_success,
  config.path_password_reset_success,
  config.path_invalid_link,

  // settings
  config.path_settings_base + '*',

  // dashboard
  config.path_dashboard + '*',

  // config.paths_cases
  config.path_cases + '*',
  config.path_cases_case + '*',

  // search
  config.path_search,
];

if (config.ssrEnabled) {
  // Setup SSR
  log('Initializing server side rendering');
  const ssrRoute = createSSRRoute(app, compiler);
  app.get(APP_PATHS, ssrRoute);
} else {
  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.get(APP_PATHS, require('connect-history-api-fallback')({
    verbose : __DEV__,
    logger  : require('log')('app:server:history'),
  }));
}

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  log('Enable webpack dev and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : paths.client(),
    hot         : true,
    quiet       : config.compiler_quiet,
    noInfo      : config.compiler_quiet,
    lazy        : false,
    stats       : config.compiler_stats,
  }));
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
  }));

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(paths.public()));
} else {
  log(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  if (config.serve_assets) {
    const options = {};

    if (config.ssrEnabled) {
      options.index = false;
    }
    app.use(express.static(paths.dist(), options));
  }
}

// ------------------------------------
// Parse server entrypoint
// ------------------------------------
if (!config.parse_database_uri) {
  log('DATABASE_URI not specified, falling back to localhost.');
}
const api = new ParseServer({
  appName                  : config.appName,
  databaseURI              : config.parse_database_uri || 'mongodb://localhost:27017/Experts-Assurance',
  cloud                    : path.resolve(process.cwd(), 'backend', 'main.js'),
  appId                    : process.env.APPLICATION_ID,
  javascriptKey            : process.env.JAVASCRIPT_KEY,
  masterKey                : process.env.MASTER_KEY,
  serverURL                : config.parse_server_url || `http://localhost:${config.server_port}${config.parse_server_mount_point}`, // eslint-disable-line max-len
  publicServerURL          : config.parse_server_url || `${config.secure ? 'https' : 'http'}://${config.server_host}${config.secure ? '' : ':' + config.server_port}${config.parse_server_mount_point}`, // eslint-disable-line max-len
  enableAnonymousUsers     : process.env.ANON_USERS === 'yes',
  allowClientClassCreation : true,
  maxUploadSize            : '25mb',

  // Retricts sesssions to 15 days
  sessionLength            : 15 * 24 * 60 * 60,

  // Email
  verifyUserEmails                 : config.verifyUserEmails,
  revokeSessionOnPasswordReset     : true,
  emailVerifyTokenValidityDuration : 2 * 24 * 60 * 60, // 2 days
  emailAdapter                     : {
    module: 'parse-server-mailgun',
    options: {
      fromAddress: config.mailgun_from_address,
      domain: config.mailgun_domain,
      apiKey: config.mailgun_api_key,
      templates: {
        passwordResetEmail: {
          subject: 'Reset your password for ' + config.appName,
          pathPlainText: paths.server('email-templates/password_reset_email.txt'),
          callback: (user) => ({}),
        },
        verificationEmail: {
          subject: 'Please verify your e-mail for ' + config.appName,
          pathPlainText: paths.server('email-templates/verification_email.txt'),
          callback: (user) => ({}),
        },
      },
    },
  },

  passwordPolicy : {
    doNotAllowUsername         : true,
    resetTokenValidityDuration : 2 * 60 * 60, // 2 hours
  },

  userSensitiveFields: [
  ],

  customPages: {
    invalidLink          : `${config.secure ? 'https' : 'http'}://${config.server_host}${config.secure ? '' : ':' + config.server_port}` + config.path_invalid_link,
    verifyEmailSuccess   : `${config.secure ? 'https' : 'http'}://${config.server_host}${config.secure ? '' : ':' + config.server_port}` + config.path_email_verification_success,
    choosePassword       : `${config.secure ? 'https' : 'http'}://${config.server_host}${config.secure ? '' : ':' + config.server_port}` + config.path_choose_password,
    passwordResetSuccess : `${config.secure ? 'https' : 'http'}://${config.server_host}${config.secure ? '' : ':' + config.server_port}` + config.path_password_reset_success,
  },
});

// Serve the Parse API on the /parse URL prefix
app.use(config.parse_server_mount_point, api);

// ------------------------------------
// Parse dashboard entrypoint
// ------------------------------------
const dashboard = new ParseDashboard({
  'apps': [
    {
      'appId'         : process.env.APPLICATION_ID,
      'javascriptKey' : process.env.JAVASCRIPT_KEY,
      'masterKey'     : process.env.MASTER_KEY,
      'serverURL'     : config.parse_server_url || `${config.secure ? 'https' : 'http'}://${config.server_host}${config.secure ? '' : ':' + config.server_port}${config.parse_server_mount_point}`,  // eslint-disable-line max-len
      'appName'       : config.appName,
      'production'    : !__DEV__,
    },
  ],
  'trustProxy': 1,
  'useEncryptedPasswords': true,
  'users': users.map(function (user) {
    return {
      'user' : user.username,
      'pass' : user.bcryptPassword,
    };
  }),
}, /* allowInsecureHTTP = */ __DEV__);

// Serve dashboard
app.use(config.parse_dashboard_mount_point, dashboard);

// ------------------------------------
// Graphql server entrypoint
// ------------------------------------
const invertedMap = invert(queryMap);

app.use(config.graphql_endpoint, bodyParser.json(), (req, resp, next) => {
  if (config.persistedQueries) {
    if (Array.isArray(req.body)) {
      // eslint-disable-next-line no-param-reassign
      req.body = req.body.map(({ id, ...otherParams }) => ({ query: invertedMap[id], ...otherParams }));
    } else {
      req.body.query = invertedMap[req.body.id]; // eslint-disable-line no-param-reassign
    }
  }
  next();
});

app.use(config.graphql_endpoint, bodyParser.json(), graphqlExpress((req, res) => {
  // Get the query, the same way express-graphql does it
  // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }

  cookie.plugToRequest(req, res);

  const user = getCurrentUser();
  return {
    schema,
    context: {
      user,
      locale: req.locale,
      Users: new Users({ user, connector: new UserConnector() }),
      Business: new Business({ user, connector: new BusinessConnector() }),
      Docs: new Docs({ user, connector: new DocConnector() }),
      Activities: new Activities({ user, connector: new ActivityConnector() }),
      Now: new Date().getTime(),
    },
    logFunction: require('log')('app:server:graphql'),
    debug: __DEV__,
  };
}));

app.use(config.graphiql_endpoint, graphiqlExpress({
  endpointURL : config.graphql_endpoint,
}));

// ------------------------------------
// Kue ui
// ------------------------------------
kueUiExpress(app, '/kue/', '/api');

// Create queue
config.queue;

kue.app.set('title', config.appName);

// Mount kue JSON api
app.use('/api', kue.app);

// WebSocket server for subscriptions
const server = createServer(app);

// eslint-disable-next-line
new SubscriptionServer(
  {
    onConnect: async (connectionParams) => {
      // Implement if you need to handle and manage connection
    },
    subscriptionManager,

    // the obSubscribe function is called for every new subscription
    // and we use it to set the GraphQL context for this subscription
    onSubscribe: (msg, params) => {
      return Object.assign({}, params, {
        context: {
          Business: new Business({ connector: new BusinessConnector() }),
        },
      });
    },
  },
  {
    server,
    path: config.graphql_subscriptions_endpoint,
  },
);

module.exports = { app, server };

