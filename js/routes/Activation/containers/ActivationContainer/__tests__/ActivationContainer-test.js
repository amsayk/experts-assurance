import React from 'react';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';

import { ActivationContainer } from '../ActivationContainer';

describe('landing container', () => {

  it('should render the snapshot when loading', () => {
    const tree = renderer.create(
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <ActivationContainer
          data={{
            loading: true,
          }}
          actions={{}}/>
      </IntlProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the snapshot when finished loading', () => {

    const tree = renderer.create(
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <ActivationContainer
          actions={{
            logOut: jest.fn(),
          }}
          data={{
            loading: false,
            currentUser: {
              email: 'email',
              username: 'username',
            },
          }}
        />
      </IntlProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();

  });
});

