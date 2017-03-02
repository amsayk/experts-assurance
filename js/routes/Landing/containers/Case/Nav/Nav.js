import React, { PropTypes as T } from 'react'

import { PATH_CASES_CASE } from 'vars';

import cx from 'classnames';

import style from 'routes/Landing/styles';

import Actions from '../Actions';

export default class Nav extends React.PureComponent {
  render() {
    const { id, intl, user, selectedNavItem, onNav } = this.props;
    return (
      <nav className={style.navgroup}>
        <ul className={style.nav}>

          <li className={cx(selectedNavItem === 'case.overview' && style.navSelected)}>
            <a onClick={onNav.bind(null, 'case.overview')}>
              Aperçu
            </a>
          </li>

          <li className={cx(selectedNavItem === 'case.files' && style.navSelected)}>
            <a onClick={onNav.bind(null, 'case.files')}>
              Pièces jointes
            </a>
          </li>

          <li className={cx(selectedNavItem === 'case.messages' && style.navSelected)}>
            <a onClick={onNav.bind(null, 'case.messages')}>
              Éxchanges
            </a>
          </li>
        </ul>

        <Actions/>
      </nav>
    );

  }
}

Nav.propTypes = {
  selectedNavItem : T.oneOf([
    'case.overview',
    'case.files',
    'case.messages',
  ]).isRequired,
};

