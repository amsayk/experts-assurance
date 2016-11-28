import 'parse-config';

import React from 'react';
import ReactDOM from 'react-dom';

import getCurrentUser from 'getCurrentUser';

import { Router } from 'react-router';

import messages from 'messages';

const log = require('debug')('app:client');

import doSetupVisibilityChangeObserver from 'utils/visibilityChangeObserver';
import doSetupConnectionStateChangeObserver from 'utils/connectionStateChangeObserver';

import getRoutes from './routes';

import { createNotificationController } from 'components/Snackbar';

import { ApolloProvider } from 'react-apollo';

import { Provider } from 'react-redux';

import { store, history } from 'redux/store';

import { IntlProvider, intlShape } from 'react-intl';

import intlLoader from 'utils/intl-loader';

import { client as apolloClient } from 'apollo';

import { ready } from 'redux/reducers/app/actions';

window.notificationMgr = createNotificationController(store);

const APP_MOUNT_NODE = document.getElementById('app');
const NOTIFICATIONS_MOUNT_NODE = document.getElementById('notifications');

async function render() {
  const locale = window.navigator.language;

  const { messages : translations } = await intlLoader(locale);

  const formats = {
  };

  const routes = getRoutes(store);

  class Application extends React.Component {
    static childContextTypes = {
      notificationMgr: React.PropTypes.shape({
        notify: React.PropTypes.func.isRequired,
        dismiss: React.PropTypes.func.isRequired,
      }).isRequired,
    };
    getChildContext(){
      return {
        notificationMgr: window.notificationMgr,
      };
    }
    render() {
      const { routerProps } = this.props;
      return (
        <IntlProvider defaultLocale={'en'} locale={locale} messages={translations} formats={formats}>
          <ApolloProvider store={store} client={apolloClient} immutable>
            <Router {...routerProps}/>
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
      {notificationMgr.render()}
    </Provider>,
    NOTIFICATIONS_MOUNT_NODE
  );
}

if (__DEV__) {
  if (window.devToolsExtension) {
    window.devToolsExtension.open();
  }
  if (module.hot) {
    // Development render functions
    const renderApp = render;
    const renderError = (error) => {
      const RedBox = require('redbox-react').default;

      ReactDOM.render(<RedBox error={error} />, APP_MOUNT_NODE);
    }

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
        ReactDOM.unmountComponentAtNode(APP_MOUNT_NODE);
        render();
      })
    );
  }

  window.reduxStore = store;
  window.Parse      = require('parse');
  window.Perf       = require('react-addons-perf');
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

