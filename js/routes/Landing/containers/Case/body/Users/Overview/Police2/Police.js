import React from 'react';
import T from 'prop-types';
import { withApollo } from 'react-apollo';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Loading from '../Loading';

import * as codes from 'result-codes';

import DataLoader from 'routes/Landing/DataLoader';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import selector from './selector';

import PoliceSetter from './PoliceSetter';

import SET_MUTATION from './setPolice.mutation.graphql';
import DEL_MUTATION from './delPolice.mutation.graphql';

const LABEL = 'N° Sinistre ou N° Police';

class Police extends React.Component {
  static contextTypes = {
    snackbar: T.shape({
      show: T.func.isRequired,
    }),
  };

  constructor() {
    super();

    this.onSetPolice = this.onSetPolice.bind(this);
    this.onDeletePolice = this.onDeletePolice.bind(this);

    this.state = {
      busy: false,
    };
  }
  render() {
    const { intl, currentUser, docLoading, doc, user, loading } = this.props;

    if (
      docLoading === true ||
      typeof loading === 'undefined' ||
      loading === true
    ) {
      return <Loading width={LABEL.length} />;
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>
          {LABEL}
        </div>
        <div className={style.overviewValue}>
          <PoliceSetter
            busy={this.state.busy}
            doc={doc}
            user={user}
            currentUser={currentUser}
            onSetPolice={this.onSetPolice}
            onDeletePolice={this.onDeletePolice}
          />
        </div>
      </div>
    );
  }
  onDeletePolice() {
    const self = this;
    const { doc } = self.props;
    if (doc) {
      const oldDoc = { ...doc };
      self.setState(
        {
          busy: true,
        },
        async () => {
          async function undoDeleteManager() {}

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
            data: { delPolice: { error } },
          } = await self.props.client.mutate({
            refetchQueries: ['getDoc', 'getTimeline'],
            mutation: DEL_MUTATION,
            variables: { id: doc.id },
            updateQueries: {
              recentDocs(prev, { mutationResult, queryVariables }) {
                const newDoc = mutationResult.data.delPolice.doc;

                if (prev && newDoc) {
                  const recentDocs = [newDoc, ...prev.recentDocs];
                  return {
                    recentDocs,
                  };
                }

                return prev;
              },
              // getTimeline(prev, { mutationResult, queryVariables }) {
              //   const newDoc = mutationResult.data.delPolice.doc;
              //   const newActivities = mutationResult.data.delPolice.activities;
              //
              //   if (prev && newActivities && newActivities.length) {
              //
              //     if (queryVariables && queryVariables.query && queryVariables.query.doc && queryVariables.query.doc !== newDoc.id ) {
              //       return prev;
              //     }
              //
              //     return {
              //       timeline : {
              //         cursor : prev.timeline.cursor,
              //         result : [
              //           ...newActivities,
              //           ...prev.timeline.result,
              //         ],
              //       },
              //     };
              //   }
              //
              //   return prev;
              // },
            },
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
  onSetPolice({ value }) {
    const self = this;
    const { doc } = self.props;
    if (doc) {
      const oldDoc = { ...doc };
      self.setState(
        {
          busy: true,
        },
        async () => {
          async function undoSetManager() {}

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
            data: { setPolice: { error } },
          } = await self.props.client.mutate({
            refetchQueries: ['getDoc', 'getTimeline'],
            mutation: SET_MUTATION,
            variables: { id: doc.id, value },
            updateQueries: {
              recentDocs(prev, { mutationResult, queryVariables }) {
                const newDoc = mutationResult.data.setPolice.doc;

                if (prev && newDoc) {
                  const recentDocs = [newDoc, ...prev.recentDocs];
                  return {
                    recentDocs,
                  };
                }

                return prev;
              },
              // getTimeline(prev, { mutationResult, queryVariables }) {
              //   const newDoc = mutationResult.data.setPolice.doc;
              //   const newActivities = mutationResult.data.setPolice.activities;
              //
              //   if (prev && newActivities && newActivities.length) {
              //
              //     if (queryVariables && queryVariables.query && queryVariables.query.doc && queryVariables.query.doc !== newDoc.id ) {
              //       return prev;
              //     }
              //
              //     return {
              //       timeline : {
              //         cursor : prev.timeline.cursor,
              //         result : [
              //           ...newActivities,
              //           ...prev.timeline.result,
              //         ],
              //       },
              //     };
              //   }
              //
              //   return prev;
              // },
            },
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

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({}, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, withApollo, Connect)(Police);
