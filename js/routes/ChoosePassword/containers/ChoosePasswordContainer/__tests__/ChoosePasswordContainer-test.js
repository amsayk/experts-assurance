import React from 'react';
import { compose } from 'redux';
import configureMockStore from 'redux-mock-store';
import { reduxForm } from 'redux-form/immutable';
import { IntlProvider, injectIntl } from 'react-intl';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';

import { fromJS } from 'immutable';

import { ChoosePasswordContainer } from '../ChoosePasswordContainer';

const Decorated = compose(
  injectIntl,
  reduxForm({ form: 'testForm' })
)(ChoosePasswordContainer);

const middlewares = [];
const mockStore = configureMockStore(middlewares);

describe('choose password container', () => {
  const isAuthenticated = false;
  const token = 'token';
  const username = 'username';
  const action = 'http://action';

  const store = mockStore(fromJS({
    form: {
      testForm: {},
    },
  }));

  it('should render the snapshot', () => {
    const tree = renderer.create(
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <Provider store={store}>
          <Decorated
            isAuthenticated={isAuthenticated}
            token={token}
            username={username}
            action={action}
          />
        </Provider>
      </IntlProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

