import 'whatwg-fetch';
import 'parse-config';

import refreshCurrentUser from 'utils/refreshCurrentUser';

import getMuiTheme from 'components/material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'components/material-ui/styles/MuiThemeProvider';

import checkBusiness from 'utils/checkBusiness';

import React, { PropTypes as T } from 'react';
import ReactDOM from 'react-dom';

import { Router, match } from 'react-router';

import debug from 'log';

import doSetupAppStateChangeListener from 'utils/appStateChangeObserver';
import doSetupConnectionStateChangeObserver from 'utils/connectionStateChangeObserver';

import getRoutes from './routes';

import { createSnackbarController } from 'components/Snackbar';

import { ApolloProvider } from 'react-apollo';

import { Provider } from 'react-redux';

import { store, history } from 'redux/store';

import { IntlProvider } from 'react-intl';

import intlLoader from 'utils/intl-loader';

import { client as apolloClient } from 'apollo';

import { ready } from 'redux/reducers/app/actions';

import { scrolling } from 'redux/reducers/scrolling/actions';

import { SSR, DEFAULT_LANG } from 'vars';

const log = debug('app:client');

const APP_MOUNT_NODE = document.querySelector('main');
const SNACKBAR_MOUNT_NODE = document.querySelector('#snackbar');

const muiTheme = getMuiTheme({
});

let render = async function render() {
  store.dispatch(scrolling());

  // Watch for expired session
  refreshCurrentUser();

  const locale = store.getState().getIn(['app', 'lang']);

  const { messages : translations } = await intlLoader(locale);

  const formats = {
  };

  const routes = getRoutes(store);
  const snackbar = createSnackbarController(store);

  class Application extends React.Component {
    static childContextTypes = {
      snackbar: T.shape({
        show    : T.func.isRequired,
        dismiss : T.func.isRequired,
      }).isRequired,
    };
    getChildContext() {
      return {
        snackbar,
      };
    }
    componentWillMount() {
      this._connectionStateListener = doSetupConnectionStateChangeObserver(store);
      this._appStateListener = doSetupAppStateChangeListener(store);
    }
    componentWillUnmount() {
      this._connectionStateListener && this._connectionStateListener.remove();
      this._appStateListener && this._appStateListener.remove();
    }
    render() {
      const { routerProps } = this.props;
      return (
        <IntlProvider defaultLocale={DEFAULT_LANG} locale={locale} messages={translations} formats={formats}>
          <ApolloProvider store={store} client={apolloClient} immutable>
            <Router {...routerProps}/>
          </ApolloProvider>
        </IntlProvider>
      );
    }
  }

  if (SSR) {
    match({ history, routes }, (error, redirectLocation, renderProps) => {
      ReactDOM.render(
        <MuiThemeProvider muiTheme={muiTheme}>
          <Application routerProps={renderProps}/>
        </MuiThemeProvider>,
        APP_MOUNT_NODE,
        () => store.dispatch(ready())
      );
    });
  } else {
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
        <Application routerProps={{ history, routes }}/>
      </MuiThemeProvider>,
      APP_MOUNT_NODE,
      () => store.dispatch(ready())
    );

  }

  // Did you enter business details?
  checkBusiness();

  ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
      <IntlProvider defaultLocale={DEFAULT_LANG} locale={locale} messages={translations} formats={formats}>
        <Provider store={store}>
          {snackbar.render()}
        </Provider>
      </IntlProvider>
    </MuiThemeProvider>,
    SNACKBAR_MOUNT_NODE
  );
};

if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
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
        render();
      })
    );
  }

  // Show all debug messages.
  localStorage.debug = '*';

  window.reduxStore   = store;
  window.Parse        = require('parse');
  window.Perf         = require('react-addons-perf');
  window.reduxHistory = history;
} else {
  require('offline-plugin/runtime').install({
    onInstalled: function () {
      log('[SW]: App is ready for offline usage');
    },
    onUpdating: function () {

    },
    onUpdateReady: function () {
      require('offline-plugin/runtime').applyUpdate();
    },
    onUpdateFailed: function () {

    },
    onUpdated: function () {

    },

  });
}

// ========================================================
// Go!
// ========================================================
render();

