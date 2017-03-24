import React, { PropTypes as T } from 'react'
import { Link } from 'react-router';

import Title from 'components/Title';

import { APP_NAME } from 'vars';

import { FolderIcon } from 'components/icons/MaterialIcons';

import cx from 'classnames';

import style from 'routes/Landing/styles';

export default class Nav extends React.Component {

  render() {
    const { intl, user, selectedNavItem } = this.props;

    if (user.isAdminOrAgent) {
      return (
        <nav className={style.navgroup}>
          <Title title={getTitle(selectedNavItem)}/>
          <ul className={style.nav}>

            <li className={cx(selectedNavItem === 'app.home' && style.navSelected)}>
              <Link to='/'>
                Accueil
              </Link>
            </li>

            <li className={cx(selectedNavItem === 'app.cases' && style.navSelected)}>
              <Link to='/cases'>
                Dossiers
              </Link>
            </li>

            <li className={cx(selectedNavItem === 'app.dashboard' && style.navSelected)}>
              <Link to='/dashboard'>
                Tableau de bord
              </Link>
            </li>
          </ul>
        </nav>
      );
    }

    // client
    return (
      <nav className={cx(style.navgroup, style.clients)}>
        <Title title='Mes dossiers'/>
        <FolderIcon size={32}/>
        Mes dossiers
      </nav>
    );
  }
}

Nav.propTypes = {
  selectedNavItem : T.oneOf([
    'app.home',
    'app.dashboard',
    'app.cases',
  ]).isRequired,
};

function getTitle(nav) {
  switch (nav) {
    // case 'app.home'      : return `Accueil · ${APP_NAME}`;
    case 'app.cases'     : return `Dossiers · ${APP_NAME}`;
    case 'app.dashboard' : return `Tableau de bord · ${APP_NAME}`;
  }
}

