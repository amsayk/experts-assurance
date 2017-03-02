import React, { PropTypes as T } from 'react'
import { Link } from 'react-router';

import { FolderIcon } from 'components/icons/MaterialIcons';

import cx from 'classnames';

import style from 'routes/Landing/styles';

export default class Nav extends React.Component {

  render() {
    const { intl, user, selectedNavItem } = this.props;

    if (user.isAdminOrAgent) {
      return (
        <nav className={style.navgroup}>
          <ul className={style.nav}>

            <li className={cx(selectedNavItem === 'app.dashboard' && style.navSelected)}>
              <Link to='/'>
                Tableau de bord
              </Link>
            </li>

            <li className={cx(selectedNavItem === 'app.cases' && style.navSelected)}>
              <Link to='/cases'>
                Dossiers
              </Link>
            </li>
          </ul>
        </nav>
      );
    }

    // client
    return (
      <nav className={cx(style.navgroup, style.clients)}>
        <FolderIcon size={32}/>
        Mes dossiers
      </nav>
    );
  }
}

Nav.propTypes = {
  selectedNavItem : T.oneOf(['app.dashboard', 'app.cases']).isRequired,
};

