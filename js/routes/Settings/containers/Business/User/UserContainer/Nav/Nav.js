import React from 'react';
import T from 'prop-types';
import { Link } from 'react-router';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

import cx from 'classnames';

import style from 'routes/Settings/styles';

export default class Nav extends React.Component {
  render() {
    const { intl, user = {}, selectedNavItem } = this.props;

    return (
      <nav className={style.navgroup}>
        <ul className={style.nav}>
          <li
            className={cx(
              selectedNavItem === 'user.overview' && style.navSelected,
            )}
          >
            <Link
              to={
                PATH_SETTINGS_BASE +
                '/' +
                PATH_SETTINGS_BUSINESS_USER +
                '/' +
                user.id
              }
            >
              Aperçu
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

Nav.propTypes = {
  selectedNavItem: T.oneOf(['user.overview']).isRequired,
};
