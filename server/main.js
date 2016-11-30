import './parse-config';

import 'isomorphic-fetch';

import { TITLE } from 'environment';
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

import { apolloExpress, graphiqlExpress } from 'apollo-server';
import {
  makeExecutableSchema,
} from 'graphql-tools';
import { schema as Schema, resolvers as Resolvers } from 'data/schema';

import bodyParser from 'body-parser';

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
app.use(require('connect-history-api-fallback')());

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

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(paths.client('static')));
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
  databaseURI              : config.parse_database_uri || 'mongodb://localhost:27017/b2b-trading-platform',
  cloud                    : path.resolve(process.cwd(), 'backend', 'main.js'),
  appId                    : process.env.APPLICATION_ID,
  javascriptKey            : process.env.JAVASCRIPT_KEY,
  masterKey                : process.env.MASTER_KEY,
  serverURL                : config.parse_server_url || `http://${config.server_host}:${config.server_port}${config.parse_server_mount_point}`, // eslint-disable-line max-len
  enableAnonymousUsers     : process.env.ANON_USERS === 'yes',
  allowClientClassCreation : true,
  maxUploadSize            : '25mb',
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
      'appName'       : TITLE,
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

app.use(config.graphql_endpoint, bodyParser.json(), apolloExpress((req, res) => {
  // Get the query, the same way express-graphql does it
  // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    // None of our app's queries are this long
    // Probably indicates someone trying to send an overly expensive query
    throw new Error('Query too large.');
  }

  cookie.plugToRequest(req, res);

  function getUser() {
    return Promise.resolve(getCurrentUser());
  }

  return getUser().then(user => ({
    schema: executableSchema,
    context: {
      user,
    },
    printErrors: __DEV__,
  }));
}));

if (__DEV__) {
  app.use(config.graphiql_endpoint, graphiqlExpress({
    endpointURL: config.graphql_endpoint,
    pretty: config.graphiql_pretty,
  }));
}

module.exports = app;

