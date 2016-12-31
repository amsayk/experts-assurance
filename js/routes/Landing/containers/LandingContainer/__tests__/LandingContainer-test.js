import React from 'react';
import { IntlProvider } from 'react-intl';
import renderer from 'react-test-renderer';

import { LandingContainer } from '../LandingContainer';

describe('landing container', () => {

  it('should render the snapshot when loading', () => {
    const tree = renderer.create(
      <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
        <LandingContainer
          data={{
            loading: true,
          }}
          actions={{}}/>
      </IntlProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the snapshot when finished loading', () => {

    it('and email is verified', () => {
      const tree = renderer.create(
        <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
          <LandingContainer
            actions={{
              logOut: jest.fn(),
            }}
            data={{
              loading: false,
              currentUser: {
                email: 'email',
                username: 'username',
                emailVerified: true,
              },
            }}
          />
        </IntlProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('and email is not verified', () => {
      const tree = renderer.create(
        <IntlProvider defaultLocale={'en'} locale={'en'} messages={{}} formats={{}}>
          <LandingContainer
            actions={{
              logOut: jest.fn(),
            }}
            data={{
              loading: false,
              currentUser: {
                email: 'email',
                username: 'username',
                emailVerified: false,
              },
            }}
          />
        </IntlProvider>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});

