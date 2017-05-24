import React from 'react'

import style from 'routes/Settings/styles';

import cx from 'classnames';

import Authorization from './Authorization';

import { userHasRoleAll, Role_ADMINISTRATORS, Role_MANAGERS, Role_CLIENTS, Role_AGENTS } from 'roles';

const ROLE_TITLE = {
  [Role_MANAGERS]       : 'Gestionnaire',
  [Role_ADMINISTRATORS] : 'Admin',
  [Role_CLIENTS]        : 'Assuré',
  [Role_AGENTS]         : 'Agent',
};

export default class Overview extends React.Component {
  render() {
    const { intl, currentUser, user, loading } = this.props;
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

          {user && (userHasRoleAll(user, Role_ADMINISTRATORS) || userHasRoleAll(user, Role_MANAGERS)) ? <div className={style.overviewLine}>
            <div className={style.overviewLabel}>Adresse e-mail</div>
            <div className={style.overviewValue}>
              {loading ? null : user.email || '—'}
            </div>
          </div> : null}

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

          {(() => {
            if (loading) {
              return null;
            }

            if (!userHasRoleAll(currentUser, Role_ADMINISTRATORS) && !currentUser.isSelf(user)) {
              return null;
            }

            if (!userHasRoleAll(user, Role_MANAGERS)) {
              return null;
            }

            return (
              <div className={style.overviewLine}>
                <div className={style.overviewLabelAuthorization}>Autorization</div>
                <div className={style.overviewValue}>
                  {loading ? null : <Authorization currentUser={currentUser} user={user}/>}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}

