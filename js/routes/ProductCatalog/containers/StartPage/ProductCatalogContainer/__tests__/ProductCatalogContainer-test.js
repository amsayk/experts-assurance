import React from 'react';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';

import { ProductCatalogContainer } from '../ProductCatalogContainer';

describe('product catalog container', () => {

  it('should render the snapshot when loading', () => {
    const tree = renderer.create(
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <ProductCatalogContainer
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
        <ProductCatalogContainer
          actions={{
            logOut: jest.fn(),
          }}
          data={{
            loading: false,
            currentUser: {
              email: 'email',
              username: 'username',
              emailVerified: true,
              business: {
                id: 'business-id',
              },
            },
          }}
        />
      </IntlProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();

  });
});

