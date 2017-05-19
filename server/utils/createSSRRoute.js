import path from 'path';

import Parse from 'parse/node';

import { updateIntl } from 'redux/reducers/intl/actions';

import config from 'build/config';

import createStore from 'server/store';
import getRoutes from 'server/routes';

import intlLoader from 'server/intl-loader';

import cookie from 'react-cookie';

import {StringDecoder} from 'string_decoder';

import { match } from 'react-router';

import formats from 'intl-formats';

import createRenderEngine from './createRenderEngine';

import loading from './LoadingAnimation';

const log = require('log')('app:backend:ssr');

const decoder = new StringDecoder('utf8');

module.exports = function createSSRRoute(app, compiler) {
  const renderEngine = createRenderEngine(app);

  const headRegExp = /(<\/head>)/i;
  const mainRegExp = /(<\/main>)/i;

  const indexHtml = new Promise((resolve, reject) => {
    if (__DEV__) {
      compiler.plugin('done', function () {
        // Webpack is done compiling
        const filename = path.join(compiler.outputPath, 'index.html');
        compiler.outputFileSystem.readFile(filename, 'utf8', function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(decoder.write(data));
          }
        });
      });
    } else {
      require('fs').readFile(config.utils_paths.dist('index.html'), 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }
  });

  return async function routeSSR(req, res, next) {
    // Reload user everytime
    Parse.User._clearCache();

    const unplug = cookie.plugToRequest(req, res);
    res.on('finish', function () {
      unplug();
    });

    const index = await indexHtml;

    const lang = config.supportedLangs.indexOf(req.locale.language) !== -1
      ? req.locale.language
      : config.lang;

    const store = createStore({ lang });

    const locale = store.getState().getIn(['intl', 'locale']);

    const { messages : translations } = intlLoader(locale);

    // Update messages if not default locale
    if (locale !== config.lang) {
      store.dispatch(updateIntl({ messages : translations, formats }));
    }

    match({ routes: getRoutes(store), location: req.originalUrl }, async (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send();
      } else if (redirectLocation) {
        res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        res.set('content-type', 'text/html');
        res.write(loading);
        try {
          const { title, html, appState, apolloState } = await renderEngine({
            renderProps,
            req,
            res,
            store,
          });

          const head = [
            title,
            `<script>window.__APOLLO_STATE__=${apolloState};</script>`,
            `<script>window.__APP_STATE__=${appState};</script>`,
          ];

          let body = index;

          body = body.replace(headRegExp, function (match) {
            return head.join('') + match;
          });

          body = body.replace(mainRegExp, function (match) {
            return html + match;
          });

          res.status(200).end(body);
        } catch (error2)  {
          log.error('failed to load', error2);
          res.status(500).send();
        }
      } else {
        res.status(404).send();
      }
    });
  };
}

