import React from 'react';
import T from 'prop-types';
import { withApollo } from 'react-apollo';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as codes from 'result-codes';

import Button from 'components/bootstrap/Button';

import { injectIntl } from 'react-intl';

import { toastr } from 'containers/Toastr';

import raf from 'utils/requestAnimationFrame';

import style from 'routes/Settings/styles';

import ByUser from './ByUser';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

import REVOKE_MUTATION from './revokeManagerAuthorization.mutation.graphql';
import GRANT_MUTATION from './authorizeManager.mutation.graphql';

const CONFIRM_GRANT = (
  <div style={style.confirmToastr}>
    <h5>Êtes-vous sûr?</h5>
    <div>Cet utilisateur aura accès aux dossiers.</div>
  </div>
);

const CONFIRM_REVOKE = (
  <div style={style.confirmToastr}>
    <h5>Êtes-vous sûr?</h5>
    <div>Cet utilisateur ne pourra plus accèder aux dossiers.</div>
  </div>
);

class Authorization extends React.Component {
  static contextTypes = {
    snackbar: T.shape({
      show: T.func.isRequired,
    }),
  };

  constructor() {
    super();

    this.onRevoke = this.onRevoke.bind(this);
    this.onGrantAuthorization = this.onGrantAuthorization.bind(this);

    this.state = {
      busy: false,
    };
  }

  onRevoke() {
    const self = this;

    if (!self.state.busy) {
      toastr.confirm(CONFIRM_REVOKE, {
        cancelText: 'Non',
        okText: 'Oui',
        onOk: doAction,
      });
    }

    function doAction() {
      const { user } = self.props;
      if (user) {
        const oldUser = { ...user };
        self.setState(
          {
            busy: true,
          },
          async () => {
            async function undoRevoke() {}

            function retry() {}

            function onError(errorText) {
              self.context.snackbar.show({
                message: errorText,
                persist: true,
                closeable: true,
                action: {
                  title: 'Réessayer',
                  click: function() {
                    this.dismiss();
                    setTimeout(() => {
                      raf(() => {
                        retry();
                      });
                    }, 0);
                  },
                },
              });
            }

            const {
              data: { revokeManagerAuthorization: { error } },
            } = await self.props.client.mutate({
              refetchQueries: ['settings_user__getUser'],
              mutation: REVOKE_MUTATION,
              variables: { id: user.id },
              updateQueries: {},
            });

            if (error) {
              switch (error.code) {
                case codes.ERROR_ACCOUNT_NOT_VERIFIED:
                case codes.ERROR_NOT_AUTHORIZED:
                  onError(`Vous n'êtes pas authorisé.`);
                  break;
                case codes.ERROR_ILLEGAL_OPERATION:
                  onError(`Cette opération est illégale.`);
                  break;
                default:
                  onError(`Erreur inconnu, veuillez réessayer à nouveau.`);
              }
            } else {
              self.setState({ busy: false });
              self.context.snackbar.show({
                message: 'Succès',
                // duration : 7 * 1000,
              });
            }
          },
        );
      }
    }
  }
  onGrantAuthorization() {
    const self = this;
    if (!self.state.busy) {
      toastr.confirm(CONFIRM_GRANT, {
        cancelText: 'Non',
        okText: 'Oui',
        onOk: doAction,
      });
    }

    function doAction() {
      const { user } = self.props;
      if (user) {
        const oldUser = { ...user };
        self.setState(
          {
            busy: true,
          },
          async () => {
            async function undoAuthorize() {}

            function retry() {}

            function onError(errorText) {
              self.context.snackbar.show({
                message: errorText,
                persist: true,
                closeable: true,
                action: {
                  title: 'Réessayer',
                  click: function() {
                    this.dismiss();
                    setTimeout(() => {
                      raf(() => {
                        retry();
                      });
                    }, 0);
                  },
                },
              });
            }

            const {
              data: { authorizeManager: { error } },
            } = await self.props.client.mutate({
              refetchQueries: ['settings_user__getUser'],
              mutation: GRANT_MUTATION,
              variables: { id: user.id },
              updateQueries: {},
            });

            if (error) {
              switch (error.code) {
                case codes.ERROR_ACCOUNT_NOT_VERIFIED:
                case codes.ERROR_NOT_AUTHORIZED:
                  onError(`Vous n'êtes pas authorisé.`);
                  break;
                case codes.ERROR_ILLEGAL_OPERATION:
                  onError(`Cette opération est illégale.`);
                  break;
                default:
                  onError(`Erreur inconnu, veuillez réessayer à nouveau.`);
              }
            } else {
              self.setState({ busy: false });
              self.context.snackbar.show({
                message: 'Succès',
                // duration : 7 * 1000,
              });
            }
          },
        );
      }
    }
  }
  render() {
    const { intl, currentUser, user } = this.props;
    return (
      <div style={styles.root}>
        <div style={styles.info}>
          {user.authorization
            ? [
                <ByUser userId={user.authorization.user.id} />,
                <span title={intl.formatDate(user.authorization.date)}>
                  {' '}le {intl.formatDate(user.authorization.date)}
                  {' à '}
                  {intl.formatTime(user.authorization.date)}
                </span>,
              ]
            : <span>Cet utilisateur n'a pas été autorisé</span>}
        </div>
        {currentUser.isAdmin
          ? [
              <div style={styles.dot}>·</div>,
              <div style={styles.action}>
                {user.authorization
                  ? <Button
                      className={style.authorizationBtn}
                      bsStyle='link'
                      onClick={this.onRevoke}
                      role='button'
                    >
                      Révoquer son autorisation
                    </Button>
                  : <Button
                      className={style.authorizationBtn}
                      bsStyle='link'
                      onClick={this.onGrantAuthorization}
                      role='button'
                    >
                      Autoriser
                    </Button>}
              </div>,
            ]
          : null}
      </div>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    fontStyle: 'italic',
  },
  action: {},
  dot: {
    margin: 'auto 6px',
  },
};

export default compose(injectIntl, withApollo)(Authorization);
