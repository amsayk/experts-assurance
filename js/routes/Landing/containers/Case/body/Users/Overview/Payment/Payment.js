import React, { PropTypes as T } from 'react'
import { withApollo } from 'react-apollo';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Loading from '../Loading';

import * as codes from 'result-codes';

import DataLoader from 'routes/Landing/DataLoader';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import selector from './selector';

import PaymentSetter from './PaymentSetter';

import SET_MUTATION from './setPay.mutation.graphql';
import DEL_MUTATION from './delPay.mutation.graphql';

const LABEL = 'Paiement';

class Payment extends React.Component {
  static contextTypes = {
    snackbar : T.shape({
      show : T.func.isRequired,
    }),
  };

  constructor() {
    super();

    this.onSetPayment = this.onSetPayment.bind(this);
    this.onDeletePayment = this.onDeletePayment.bind(this);

    this.state = {
      busy : false,
    };
  }
  render() {
    const { intl, currentUser, docLoading, doc, user, loading } = this.props;

    if (docLoading === true || (typeof loading === 'undefined') || loading === true) {
      return (
        <Loading width={LABEL.length}/>
      );
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>
          {LABEL}
        </div>
        <div className={style.overviewValue}>
          <PaymentSetter
            busy={this.state.busy}
            doc={doc}
            user={user}
            currentUser={currentUser}
            onSetPayment={this.onSetPayment}
            onDeletePayment={this.onDeletePayment}
          />
        </div>
      </div>
    );
  }
  onDeletePayment() {
    const self = this;
    const { doc } = self.props;
    if (doc) {
      const oldDoc = { ...doc };
      self.setState({
        busy : true,
      }, async () => {

        async function undoDeleteManager() {

        }

        function retry() {

        }

        function onError(errorText) {
          self.context.snackbar.show({
            message   : errorText,
            persist   : true,
            closeable : true,
            action    : {
              title : 'Réessayer',
              click : function () {
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

        const { data: { delPay: { error } } } = await self.props.client.mutate({
          refetchQueries     : ['getDoc', 'unpaidDocs'],
          mutation           : DEL_MUTATION,
          variables          : { id : doc.id },
          updateQueries : {
            recentDocs(prev, { mutationResult, queryVariables }) {
              const newDoc = mutationResult.data.delPay.doc;

              if (prev && newDoc) {
                const docs = [
                  newDoc,
                  ...prev.docs
                ];
                return {
                  docs,
                };
              }

              return prev;
            },
            getTimeline(prev, { mutationResult, queryVariables }) {
              const newDoc = mutationResult.data.delPay.doc;
              const newActivities = mutationResult.data.delPay.activities;

              if (prev && newActivities && newActivities.length) {

                if (queryVariables && queryVariables.query && queryVariables.query.doc && queryVariables.query.doc !== newDoc.id ) {
                  return prev;
                }

                return {
                  timeline : {
                    cursor : prev.timeline.cursor,
                    result : [
                      ...newActivities,
                      ...prev.timeline.result,
                    ],
                  },
                };
              }

              return prev;
            },
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
          self.setState({ busy : false });
          self.context.snackbar.show({
            message  : 'Succès',
            // duration : 7 * 1000,
          });
        }
      });

    }
  }
  onSetPayment(info) {
    const self = this;
    const { doc } = self.props;
    if (doc) {
      const oldDoc = { ...doc };
      self.setState({
        busy : true,
      }, async () => {

        async function undoSetManager() {

        }

        function retry() {

        }

        function onError(errorText) {
          self.context.snackbar.show({
            message   : errorText,
            persist   : true,
            closeable : true,
            action    : {
              title : 'Réessayer',
              click : function () {
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

        const { data: { setPay: { error } } } = await self.props.client.mutate({
          refetchQueries     : ['getDoc', 'unpaidDocs'],
          mutation           : SET_MUTATION,
          variables          : { id : doc.id, info },
          updateQueries : {
            recentDocs(prev, { mutationResult, queryVariables }) {
              const newDoc = mutationResult.data.setPay.doc;

              if (prev && newDoc) {
                const docs = [
                  newDoc,
                  ...prev.docs
                ];
                return {
                  docs,
                };
              }

              return prev;
            },
            getTimeline(prev, { mutationResult, queryVariables }) {
              const newDoc = mutationResult.data.setPay.doc;
              const newActivities = mutationResult.data.setPay.activities;

              if (prev && newActivities && newActivities.length) {

                if (queryVariables && queryVariables.query && queryVariables.query.doc && queryVariables.query.doc !== newDoc.id ) {
                  return prev;
                }

                return {
                  timeline : {
                    cursor : prev.timeline.cursor,
                    result : [
                      ...newActivities,
                      ...prev.timeline.result,
                    ],
                  },
                };
              }

              return prev;
            },
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
          self.setState({ busy : false });
          self.context.snackbar.show({
            message  : 'Succès',
            // duration : 7 * 1000,
          });
        }
      });

    }
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  withApollo,
  Connect,
  DataLoader.user,
)(Payment);

