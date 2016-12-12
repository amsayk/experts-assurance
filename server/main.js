import './parse-config';

import 'isomorphic-fetch';

import getCurrentUser from 'getCurrentUser';

import users from 'data/_User';

import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import config from '../build/config';
import compress from 'compression';

import cookie from 'react-cookie';
import createLocaleMiddleware from 'express-locale';
import ua from 'express-useragent';
import cors from 'cors';

import { ParseServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';

import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import {
  makeExecutableSchema,
} from 'graphql-tools';
import { schema as Schema, resolvers as Resolvers } from 'data/schema';

// Connectors
import { UserConnector } from 'data/user/connector';

// Models
import { Users } from 'data/user/models';

import bodyParser from 'body-parser';

const graphqlDebug = require('debug')('app:server:graphql');
const debug = require('debug')('app:server');
const error = require('debug')('app:server:error');

const databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI;
if (!databaseUri) {
  debug('DATABASE_URI not specified, falling back to localhost.');
}

const app = express();
const paths = config.utils_paths;

// Don't rate limit heroku
app.enable('trust proxy');

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement universal
// rendering, you'll want to remove this middleware.
app.use(require('connect-history-api-fallback')({
  verbose : __DEV__,
  logger  : require('debug')('app:server:history'),
}));

// Apply gzip compression
app.use(compress());

// Enable cors support
app.use(cors());

// Setup locale
app.use(createLocaleMiddleware());

// Useragent detection
app.use(ua.express());

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.env === 'development') {
  const compiler = webpack(webpackConfig);

  debug('Enable webpack dev and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : paths.client(),
    hot         : true,
    quiet       : config.compiler_quiet,
    noInfo      : config.compiler_quiet,
    lazy        : false,
    stats       : config.compiler_stats,
  }));
  app.use(require('webpack-hot-middleware')(compiler));

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(paths.public()));
} else {
  debug(
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
    app.use(express.static(paths.dist()));
  }
}

// ------------------------------------
// Parse server entrypoint
// ------------------------------------
if (!config.parse_database_uri) {
  debug('DATABASE_URI not specified, falling back to localhost.');
}
const api = new ParseServer({
  appName                  : config.appName,
  databaseURI              : config.parse_database_uri || 'mongodb://localhost:27017/b2b-trading-platform',
  cloud                    : path.resolve(process.cwd(), 'backend', 'main.js'),
  appId                    : process.env.APPLICATION_ID,
  javascriptKey            : process.env.JAVASCRIPT_KEY,
  masterKey                : process.env.MASTER_KEY,
  serverURL                : config.parse_server_url || `http://${config.server_host}:${config.server_port}${config.parse_server_mount_point}`, // eslint-disable-line max-len
  publicServerURL                : config.parse_server_url || `http://${config.server_host}:${config.server_port}${config.parse_server_mount_point}`, // eslint-disable-line max-len
  enableAnonymousUsers     : process.env.ANON_USERS === 'yes',
  allowClientClassCreation : true,
  maxUploadSize            : '25mb',

  // Retricts sesssions to 15 days
  sessionLength            : 15 * 24 * 60 * 60,

  // Email
  verifyUserEmails                 : true,
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
    invalidLink          : `http://${config.server_host}:${config.server_port}` + config.path_invalid_link,
    verifyEmailSuccess   : `http://${config.server_host}:${config.server_port}` + config.path_email_verification_success,
    choosePassword       : `http://${config.server_host}:${config.server_port}` + config.path_choose_password,
    passwordResetSuccess : `http://${config.server_host}:${config.server_port}` + config.path_password_reset_success,
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
      'serverURL'     : config.parse_server_url || `http://${config.server_host}:${config.server_port}${config.parse_server_mount_point}`,  // eslint-disable-line max-len
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
const executableSchema = makeExecutableSchema({
  typeDefs                : Schema,
  resolvers               : Resolvers,
  allowUndefinedInResolve : false,
  logger                  : { log: (e) => error('[GRAPHQL ERROR]', e.stack) },
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
    schema: executableSchema,
    context: {
      user,
      Users: new Users({ user, connector: new UserConnector() }),
    },
    logFunction: graphqlDebug,
    debug: __DEV__,
  };
}));

if (__DEV__) {
  app.use(config.graphiql_endpoint, graphiqlExpress({
    endpointURL: config.graphql_endpoint,
  }));
}

module.exports = app;

