import 'parse-config';

import React, { PropTypes as T } from 'react';
import ReactDOM from 'react-dom';

import { Router } from 'react-router';

const log = require('debug')('app:client');

import doSetupVisibilityChangeObserver from 'utils/visibilityChangeObserver';
import doSetupConnectionStateChangeObserver from 'utils/connectionStateChangeObserver';

import getRoutes from './routes';

import { createNotificationController } from 'components/Snackbar';

import { ApolloProvider } from 'react-apollo';

import { Provider } from 'react-redux';

import { store, history } from 'redux/store';

import { IntlProvider } from 'react-intl';

import intlLoader from 'utils/intl-loader';

import { client as apolloClient } from 'apollo';

import { ready } from 'redux/reducers/app/actions';

const APP_MOUNT_NODE = document.querySelector('#app');
const NOTIFICATIONS_MOUNT_NODE = document.querySelector('#notifications');

let render = async function render() {
  const locale = window.navigator.language.split(/-/)[0];

  const { messages : translations } = await intlLoader(locale);

  const formats = {
  };

  const routes = getRoutes(store);
  const snackbar = createNotificationController(store);

  class Application extends React.Component {
    static childContextTypes = {
      snackbar: T.shape({
        notify  : T.func.isRequired,
        dismiss : T.func.isRequired,
      }).isRequired,
    };
    getChildContext() {
      return {
        snackbar,
      };
    }
    render() {
      const { routerProps } = this.props;
      return (
        <IntlProvider defaultLocale={'en'} locale={locale} messages={translations} formats={formats}>
          <ApolloProvider store={store} client={apolloClient} immutable>
            <div style={{ height: '100%' }}>
              <Router {...routerProps}/>
            </div>
          </ApolloProvider>
        </IntlProvider>
      );
    }
  }

  ReactDOM.render(
    <Application routerProps={{history, routes}}/>, APP_MOUNT_NODE, () => store.dispatch(ready())
  );

  ReactDOM.render(
    <Provider store={store}>
      {snackbar.render()}
    </Provider>,
    NOTIFICATIONS_MOUNT_NODE
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
        ReactDOM.unmountComponentAtNode(NOTIFICATIONS_MOUNT_NODE);
        render();
      })
    );
  }

  window.reduxStore   = store;
  window.Parse        = require('parse');
  window.Perf         = require('react-addons-perf');
  window.reduxHistory = history;
} else {
  doSetupVisibilityChangeObserver(store);
  doSetupConnectionStateChangeObserver(store);

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

