import 'whatwg-fetch';
import 'parse-config';

import refreshCurrentUser from 'utils/refreshCurrentUser';

import getMuiTheme from 'components/material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'components/material-ui/styles/MuiThemeProvider';

import checkBusiness from 'utils/checkBusiness';

import React from 'react';
import T from 'prop-types';
import ReactDOM from 'react-dom';

import { Router, match } from 'react-router';

import debug from 'log';

// import doSetupAppStateChangeListener from 'utils/appStateChangeObserver';
import doSetupConnectionStateChangeObserver from 'utils/connectionStateChangeObserver';

import getRoutes from './routes';

import { ApolloProvider } from 'react-apollo';

import * as ReactGA from 'react-ga';

import { Provider } from 'react-redux';

import { store, history } from 'redux/store';

import IntlProvider from 'IntlProvider';

import intlLoader from 'utils/intl-loader';

import Toastr from 'containers/Toastr';

import { client as apolloClient } from 'apollo';

import { ready } from 'redux/reducers/app/actions';

import { scrolling } from 'redux/reducers/scrolling/actions';

import formats from 'intl-formats';

import { updateIntl } from 'redux/reducers/intl/actions';

import {
  DEBUG,
  SSR,
  DEFAULT_LANG,
  GA_TRACKING_ID,
  REFRESH_ACCOUNT_INTERVAL,
} from 'vars';

const log = debug('app:client');

const APP_MOUNT_NODE = document.querySelector('main');
const SNACKBAR_MOUNT_NODE = document.querySelector('#snackbar');
const TOASTR_MOUNT_NODE = document.querySelector('#toastr');

const muiTheme = getMuiTheme({});

let render = async function render() {
  store.dispatch(scrolling());

  // Watch for expired session
  refreshCurrentUser();
  setInterval(refreshCurrentUser, REFRESH_ACCOUNT_INTERVAL || 5 * 60 * 1000); // refresh every 5 minutes to detect expired sessions

  const locale = store.getState().getIn(['intl', 'locale']);

  const { messages: translations } = await intlLoader(locale);

  // Update messages if not default locale
  if (locale !== DEFAULT_LANG) {
    store.dispatch(updateIntl({ locale, messages: translations, formats }));
  }

  const intlSelector = state => ({
    defaultLocale: state.getIn(['intl', 'defaultLocale']),
    locale: state.getIn(['intl', 'locale']),
    messages: state.getIn(['intl', 'messages']),
    formats: state.getIn(['intl', 'formats']),
  });

  const routes = getRoutes(store);

  global.logPageView = function logPageView() {};

  class Application extends React.Component {
    static childContextTypes = {
      snackbar: T.shape({
        show: T.func.isRequired,
        dismiss: T.func.isRequired,
      }).isRequired,
    };
    getChildContext() {
      return {
        snackbar: store.snackbar,
      };
    }
    componentWillMount() {
      this._connectionStateListener = doSetupConnectionStateChangeObserver(
        store,
      );
      // this._appStateListener = doSetupAppStateChangeListener(store);
    }
    componentWillUnmount() {
      this._connectionStateListener && this._connectionStateListener.remove();
      // this._appStateListener && this._appStateListener.remove();
    }
    render() {
      const { routerProps } = this.props;
      return (
        <ApolloProvider store={store} client={apolloClient} immutable>
          <IntlProvider intlSelector={intlSelector}>
            <Router {...routerProps} onUpdate={logPageView} />
          </IntlProvider>
        </ApolloProvider>
      );
    }
  }

  if (SSR) {
    match({ history, routes }, (error, redirectLocation, renderProps) => {
      ReactDOM.render(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Application routerProps={renderProps} />
        </MuiThemeProvider>,
        APP_MOUNT_NODE,
        () => store.dispatch(ready()),
      );
    });
  } else {
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Application routerProps={{ history, routes }} />
      </MuiThemeProvider>,
      APP_MOUNT_NODE,
      () => store.dispatch(ready()),
    );
  }

  // Did you enter business details?
  checkBusiness();

  // check for pending authorizations
  // TODO:

  ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <Provider store={store}>
        <IntlProvider intlSelector={intlSelector}>
          {store.snackbar.render()}
        </IntlProvider>
      </Provider>
    </MuiThemeProvider>,
    SNACKBAR_MOUNT_NODE,
  );

  ReactDOM.render(
    <Provider store={store}>
      <IntlProvider intlSelector={intlSelector}>
        <Toastr />
      </IntlProvider>
    </Provider>,
    TOASTR_MOUNT_NODE,
  );
};

if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = error => {
      const RedBox = require('redbox-react').default;

      ReactDOM.render(<RedBox error={error} />, APP_MOUNT_NODE);
    };

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };

    // Setup hot module replacement
    module.hot.accept('./routes', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(APP_MOUNT_NODE);
        ReactDOM.unmountComponentAtNode(SNACKBAR_MOUNT_NODE);
        ReactDOM.unmountComponentAtNode(TOASTR_MOUNT_NODE);
        render();
      }),
    );
  }

  window.reduxStore = store;
  window.Parse = require('parse');
  window.Perf = require('react-addons-perf');
  window.reduxHistory = history;
  window.cookie = require('react-cookie');
  window.moment = require('moment');
} else {
  // Initialize Analytics
  ReactGA.initialize(GA_TRACKING_ID, {});

  global.logPageView = function logPageView() {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  };

  require('offline-plugin/runtime').install({
    onInstalled: function() {
      log('[SW]: App is ready for offline usage');
    },
    onUpdating: function() {},
    onUpdateReady: function() {
      require('offline-plugin/runtime').applyUpdate();
    },
    onUpdateFailed: function() {
      alert(`
        Erreur pendant la mise à jour de l'application.
        Veuillez réfraîchir la page et informer votre administrateur si le problème persist.
      `);
    },
    onUpdated: function() {
      setTimeout(function() {
        try {
          alert(
            `Votre application a été mise à jour. Nous allons réfraîchir la page.`,
          );
          window.location.reload();
        } catch (e) {}
      }, 0);
    },
  });
}

if (__DEV__ || DEBUG) {
  // Show all debug messages.
  localStorage.debug = DEBUG || '*';
}

// ========================================================
// Go!
// ========================================================
render();
