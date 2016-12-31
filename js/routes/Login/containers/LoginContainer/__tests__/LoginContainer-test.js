import React from 'react';
import { compose } from 'redux';
import configureMockStore from 'redux-mock-store';
import { reduxForm } from 'redux-form/immutable';
import { IntlProvider, injectIntl } from 'react-intl';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { fromJS } from 'immutable';

import { LoginContainer } from '../LoginContainer';

const Decorated = compose(
  injectIntl,
  reduxForm({ form: 'testForm' })
)(LoginContainer);

const middlewares = [];
const mockStore = configureMockStore(middlewares);

describe('login container', () => {
  const store = mockStore(fromJS({
    form: {
      testForm: {},
    },
  }));

  it('should render the snapshot when not logged in', () => {
    const tree = renderer.create(
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <Provider store={store}>
          <Decorated
            actions={{
              login: jest.fn(),
            }}
            isAuthenticated={false}
          />
        </Provider>
      </IntlProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should redirect when logged in', () => {
    const redirect = 'redirectPath';
    const router = {
      replace: jest.fn(),
    };

    renderer.create(
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <Provider store={store}>
          <Decorated
            redirect={redirect}
            router={router}
            actions={{
              login: jest.fn(),
            }}
            isAuthenticated={true}
          />
        </Provider>
      </IntlProvider>
    );
    expect(router.replace).toBeCalledWith(redirect);
  });
});

