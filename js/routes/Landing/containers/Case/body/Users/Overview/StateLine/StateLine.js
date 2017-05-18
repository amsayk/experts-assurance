import React, { PropTypes as T } from 'react'
import { withApollo } from 'react-apollo';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

import arrayFindIndex from 'array-find-index';

import Loading from '../Loading';

import { injectIntl } from 'react-intl';

import StateChanger from './StateChanger';

import raf from 'requestAnimationFrame';

import style from 'routes/Landing/styles';

import selector from './selector';

import MUTATION from './setState.mutation.graphql';

const LABEL = 'État';

const DASHBOARD_KEY_TO_DOC_STATE = {
  // pending  : 'PENDING',
  open     : 'OPEN',
  closed   : 'CLOSED',
  canceled : 'CANCELED',
}

function StateUser({ doc }) {
  let user = doc.user;

  if (doc.state === 'OPEN' && doc.validation) {
    user = doc.validation.user;
  }

  if ((doc.state === 'CANCELED' || doc.state === 'CLOSED') && doc.closure) {
    user = doc.closure.user;
  }

  if (doc.manager ? doc.manager.id === user.id : false) {
    return null;
  }

  return (
    <span style={{ marginLeft: 5, display: 'flex', alignItems: 'center' }}>
      <span>
        par{' '}
      </span>
      <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
        <span style={{ marginLeft: 5, display: 'flex', alignItems: 'center' }} className={style.text}>
          {user.displayName}
        </span>
      </Link>
    </span>
  );
}

function StateDate({ intl, doc }) {
  let date = doc.date;

  if (doc.validation) {
    date = doc.validation.date;
  }

  if (doc.closure) {
    date = doc.closure.date;
  }
  return (
    <span title={intl.formatDate(date)}>
      {' '}{intl.formatRelative(date)}
    </span>
  );
}

class StateLine extends React.Component {
  static contextTypes = {
    snackbar : T.shape({
      show : T.func.isRequired,
    }),
  };

  constructor() {
    super();

    this.onSetState = this.onSetState.bind(this);

    this.state = {
      busySetState : false,
    };
  }
  onSetState(state) {
    const self = this;
    const { doc } = self.props;
    if (doc) {
      const oldDoc = { ...doc };
      self.setState({
        busySetState : true,
      }, async () => {

        async function undoSetState() {

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

        const { data: { setState: { error } } } = await self.props.client.mutate({
          refetchQueries     : ['getDoc'],
          mutation           : MUTATION,
          variables          : { id : doc.id, state },
          optimisticResponse : {
            __typename : 'Mutation',
            setState   : {
              __typename : 'SetStateResponse',
              activities : [],
              doc        : { ...oldDoc, __typename : 'Doc', state },
              error      : null,
            },
          },
          updateQueries : {
            dashboard(prev, { mutationResult }) {
              const newDoc = mutationResult.data.setState.doc;

              if (prev && newDoc) {
                return {
                  dashboard : mapObject(prev.dashboard, (value, key) => {
                    let count = value.count;

                    if (newDoc.state === DASHBOARD_KEY_TO_DOC_STATE[key]) {
                      count = count + 1;
                    }

                    if (oldDoc.state === DASHBOARD_KEY_TO_DOC_STATE[key]) {
                      count = count - 1;
                    }
                    return {
                      ...value,
                      count,
                    };
                  }),
                };

              }

              return prev;
            },
            // pendingDocs(prev, { mutationResult, queryVariables }) {
            //   const newDoc = mutationResult.data.setState.doc;
            //
            //   if (prev && newDoc) {
            //     // Remove
            //     if (oldDoc.state === 'PENDING') {
            //       const index = arrayFindIndex(prev.pendingDashboard.docs, (doc) => newDoc.id === doc.id);
            //       const docs = index !== -1
            //         ? prev.pendingDashboard.docs.filter((doc) => doc.id !== newDoc.id)
            //         : [
            //           ...prev.pendingDashboard.docs
            //         ];
            //
            //       return {
            //         pendingDashboard : {
            //           length : prev.pendingDashboard.length - 1,
            //           cursor : prev.pendingDashboard.cursor - 1,
            //           docs,
            //         },
            //       };
            //     }
            //
            //     // Add
            //     if (newDoc.state === 'PENDING') {
            //       const docs = [
            //         newDoc,
            //         ...prev.pendingDashboard.docs
            //       ];
            //
            //       return {
            //         pendingDashboard : {
            //           length : prev.pendingDashboard.length + 1,
            //           cursor : prev.pendingDashboard.cursor + 1,
            //           docs,
            //         },
            //       };
            //     }
            //   }
            //
            //   return prev;
            // },
            // morePendingDocs(prev, { mutationResult, queryVariables }) {
            //   const newDoc = mutationResult.data.setState.doc;
            //
            //   if (prev && newDoc && oldDoc.state === 'PENDING') {
            //     const index = arrayFindIndex(prev.pendingDashboard.docs, (doc) => newDoc.id === doc.id);
            //     if (index !== -1) {
            //       const docs = prev.pendingDashboard.docs.filter((doc) => doc.id !== newDoc.id);
            //
            //       return {
            //         pendingDashboard : {
            //           cursor : prev.pendingDashboard.cursor - 1,
            //           docs,
            //         },
            //       };
            //     }
            //   }
            //
            //   return prev;
            // },
            openDocs(prev, { mutationResult, queryVariables }) {
              const newDoc = mutationResult.data.setState.doc;

              if (prev && newDoc) {
                // Remove
                if (oldDoc.state === 'OPEN') {
                  const index = arrayFindIndex(prev.openDashboard.docs, (doc) => newDoc.id === doc.id);
                  const docs = index !== -1
                    ? prev.openDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                    : [
                      ...prev.openDashboard.docs
                    ];

                  return {
                    openDashboard : {
                      length : prev.openDashboard.length - 1,
                      cursor : prev.openDashboard.cursor - 1,
                      docs,
                    },
                  };
                }

                // Add
                if (newDoc.state === 'OPEN') {
                  const docs = [
                    newDoc,
                    ...prev.openDashboard.docs
                  ];

                  return {
                    openDashboard : {
                      length : prev.openDashboard.length + 1,
                      cursor : prev.openDashboard.cursor + 1,
                      docs,
                    },
                  };
                }
              }

              return prev;
            },
            moreOpenDocs(prev, { mutationResult, queryVariables }) {
              const newDoc = mutationResult.data.setState.doc;

              if (prev && newDoc && oldDoc.state === 'OPEN') {
                const index = arrayFindIndex(prev.openDashboard.docs, (doc) => newDoc.id === doc.id);
                if (index !== -1) {
                  const docs = prev.openDashboard.docs.filter((doc) => doc.id !== newDoc.id);

                  return {
                    openDashboard : {
                      cursor : prev.openDashboard.cursor - 1,
                      docs,
                    },
                  };
                }
              }

              return prev;
            },
            // closedDocs(prev, { mutationResult, queryVariables }) {
            //   const newDoc = mutationResult.data.setState.doc;
            //
            //   if (prev && newDoc) {
            //     // Remove
            //     if (oldDoc.state === 'CLOSED' || oldDoc.state === 'CANCELED') {
            //       const index = arrayFindIndex(prev.closedDashboard.docs, (doc) => newDoc.id === doc.id);
            //       const docs = index !== -1
            //         ? prev.closedDashboard.docs.filter((doc) => doc.id !== newDoc.id)
            //         : [
            //           ...prev.closedDashboard.docs
            //         ];
            //
            //       return {
            //         closedDashboard : {
            //           length : prev.closedDashboard.length - 1,
            //           cursor : prev.closedDashboard.cursor - 1,
            //           docs,
            //         },
            //       };
            //     }
            //
            //     // Add
            //     if (newDoc.state === 'CLOSED' || newDoc.state === 'CANCELED') {
            //       const docs = [
            //         newDoc,
            //         ...prev.closedDashboard.docs
            //       ];
            //
            //       return {
            //         closedDashboard : {
            //           length : prev.closedDashboard.length + 1,
            //           cursor : prev.closedDashboard.cursor + 1,
            //           docs,
            //         },
            //       };
            //     }
            //   }
            //
            //   return prev;
            // },
            // moreClosedDocs(prev, { mutationResult, queryVariables }) {
            //   const newDoc = mutationResult.data.setState.doc;
            //
            //   if (prev && newDoc && (oldDoc.state === 'CLOSED' && oldDoc.state === 'CANCELED')) {
            //     const index = arrayFindIndex(prev.closedDashboard.docs, (doc) => newDoc.id === doc.id);
            //     if (index !== -1) {
            //       const docs = prev.closedDashboard.docs.filter((doc) => doc.id !== newDoc.id);
            //
            //       return {
            //         closedDashboard : {
            //           cursor : prev.closedDashboard.cursor - 1,
            //           docs,
            //         },
            //       };
            //     }
            //   }
            //
            //   return prev;
            // },
            recentDocs(prev, { mutationResult, queryVariables }) {
              const newDoc = mutationResult.data.setState.doc;

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
              const newDoc = mutationResult.data.setState.doc;
              const newActivities = mutationResult.data.setState.activities;

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
            // getDocs(prev, { mutationResult, queryVariables }) {
            //   const newDoc = mutationResult.data.setState.doc;
            //
            //   if (prev && newDoc) {
            //     const index = arrayFindIndex(prev.getDocs.docs, (doc) => newDoc.id === doc.id);
            //     const docs = index !== -1
            //       ? prev.getDocs.docs.filter((doc) => doc.id !== newDoc.id)
            //       : [
            //         ...prev.getDocs.docs
            //       ];
            //
            //     return {
            //       getDocs : {
            //         cursor : prev.getDocs.cursor - 1,
            //         length : prev.getDocs.length - 1,
            //         docs,
            //       },
            //     };
            //   }
            //
            //   return prev;
            // },
            // moreDocs(prev, { mutationResult, queryVariables }) {
            //   const newDoc = mutationResult.data.setState.doc;
            //
            //   if (prev && newDoc) {
            //     const index = arrayFindIndex(prev.getDocs.docs, (doc) => newDoc.id === doc.id);
            //     const docs = index !== -1
            //       ? prev.getDocs.docs.filter((doc) => doc.id !== newDoc.id)
            //       : [
            //         ...prev.getDocs.docs
            //       ];
            //
            //     return {
            //       getDocs : {
            //         cursor : prev.getDocs.cursor - 1,
            //         docs,
            //       },
            //     };
            //   }
            //
            //   return prev;
            // },
            // getDoc(prev, { mutationResult }) {
            //   const newDoc = mutationResult.data.setState.doc;
            //   if (prev && newDoc) {
            //     return {
            //       ...prev,
            //       ...newDoc,
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
          self.setState({ busySetState : false });
          self.context.snackbar.show({
            message  : 'Succès',
            // duration : 7 * 1000,
          });
        }
      });

    }
  }
  render() {
    const { intl, docLoading, doc, user } = this.props;

    if (docLoading) {
      return (
        <Loading width={LABEL.length}/>
      );
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>{LABEL}</div>
        <div className={style.overviewValueState}>
          <StateChanger
            busy={this.state.busySetState}
            deletion={doc.deletion}
            state={doc.state}
            onStateChange={this.onSetState}
          />
          <StateUser doc={doc}/>
          <StateDate intl={intl} doc={doc}/>
        </div>
      </div>
    );
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
)(StateLine);

