import React from 'react';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';

import { CaseContainer } from '../CaseContainer';

describe('cases container', () => {

  it('should render the snapshot when loading', () => {
    const tree = renderer.create(
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <CaseContainer
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
        <CaseContainer
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

