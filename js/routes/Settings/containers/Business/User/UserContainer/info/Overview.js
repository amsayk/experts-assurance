import React from 'react'

import style from 'routes/Settings/styles';

import cx from 'classnames';

import { Role_ADMINISTRATORS, Role_MANAGERS, Role_CLIENTS, Role_AGENTS } from 'roles';

const ROLE_TITLE = {
  [Role_MANAGERS]       : 'Gestionnaire',
  [Role_ADMINISTRATORS] : 'Admin',
  [Role_CLIENTS]        : 'Assuré',
  [Role_AGENTS]         : 'Agent',
};

export default class Overview extends React.Component {
  render() {
    const { intl, user, loading } = this.props;
    return (
      <div className={cx(style.overview, loading ? undefined : (user.deletion && style.deletedUser))}>
        {/* <h3 className={style.overviewTitle}> */}
        {/*   Aperçu */}
        {/* </h3> */}

        <div className={style.overviewContent}>
          <div className={style.overviewLine}>
            <div className={style.overviewLabel}>Nom complet</div>
            <div className={style.overviewValue}>
              {loading ? null : user.displayName}
            </div>
          </div>

          <div className={style.overviewLine}>
            <div className={style.overviewLabel}>Adresse e-mail</div>
            <div className={style.overviewValue}>
              {loading ? null : user.email || '—'}
            </div>
          </div>

          <div className={style.overviewLine}>
            <div className={style.overviewLabel}>Role</div>
            <div className={style.overviewValue}>
              {loading || user.roles.length === 0 ? 'N/A' : <span className={style.role}>{ROLE_TITLE[user.roles[0]]}</span>}
            </div>
          </div>

          <div className={style.overviewLine}>
            <div className={style.overviewLabel}>Dernière activité</div>
            <div className={style.overviewValue}>
              {loading ? null : <div className={style.overviewDate}>{intl.formatRelative(user.createdAt)}</div>}
            </div>
          </div>

          <div className={style.overviewLine}>
            <div className={style.overviewLabel}>Authorization</div>
            <div className={style.overviewValue}>
              {loading ? null : <span>{'TODO'}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

