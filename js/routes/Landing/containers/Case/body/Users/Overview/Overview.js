import React, { PropTypes as T } from 'react'
import { withApollo } from 'react-apollo';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import arrayFindIndex from 'array-find-index';

import DataLoader from 'routes/Landing/DataLoader';

import ActivityIndicator from 'components/ActivityIndicator';

import Clipboard from 'Clipboard';

import { injectIntl } from 'react-intl';

import raf from 'requestAnimationFrame';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import Button from 'components/bootstrap/Button';

import ClientLine from './ClientLine';
import ManagerLine from './ManagerLine';
import AgentLine from './AgentLine';
import StateLine from './StateLine';
// import RefLine from './RefLine';
// import VehicleLine from './VehicleLine';
import LastActivityLine from './LastActivityLine';
import DTValidationLine from './DTValidation';
import DTSinisterLine from './DTSinister';
import Payment from './Payment';
// import DTClosureLine from './DTClosure';
import DTMissionLine from './DTMission';
import DeletionLine from './DeletionLine';
import MTRapportsLine from './MTRapports';

import DocMenu from './DocMenu';

import { toastr } from 'containers/Toastr';

import {
  UndoIcon,
  TrashIcon,
} from 'components/icons/MaterialIcons';

import DEL_MUTATION from './delDoc.mutation.graphql';
import RESTORE_MUTATION from './restoreDoc.mutation.graphql';

import CANCEL_MUTATION from './cancelDoc.mutation.graphql';

const CONFIRM_MSG = <div style={style.confirmToastr}>
  <h5>Êtes-vous sûr?</h5>
</div>;

class Overview extends React.Component {
  static contextTypes = {
    snackbar : T.shape({
      show : T.func.isRequired,
    }),
  };

  constructor() {
    super();

    this.onDeleteOrRestoreDoc = this.onDeleteOrRestoreDoc.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onClose = this.onClose.bind(this);
    this.busy = this.busy.bind(this);

    this.copyKeyToClipboard = this.copyKeyToClipboard.bind(this);

    this.state = {
      busyAction : false,
    };
  }

  busy (busy, onEnd) {
    this.setState({
      busyAction : busy,
    }, onEnd);
  }

  copyKeyToClipboard () {
    const { doc } = this.props;
    if (doc) {
      const ok = Clipboard.setString(doc.key);
      this.context.snackbar.show({
        message  : ok ? 'Copié' : 'Impossible de copier…',
        duration : 2 * 1000,
      });

      if (ok) {
        setTimeout(() => {
          Clipboard.setString('');
        }, 2 * 60 * 1000);
      }
    }
  }
  onClose() {
    const self = this;
    const { doc } = self.props;
    if (doc) {
      toastr.confirm(CONFIRM_MSG, {
        cancelText : 'Non',
        okText     : 'Oui',
        onOk       : () => {
          self.setState({
            busyAction : true,
          }, async () => {

            async function undoClosure() {

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

            const { data: { closeDoc: { error } } } = await self.props.client.mutate({
              mutation  : CANCEL_MUTATION,
              variables : { id : doc.id },
              updateQueries : {
                dashboard(prev, { mutationResult }) {
                  const newDoc = mutationResult.data.closeDoc.doc;

                  if (prev && newDoc) {
                    // if (newDoc.state === 'PENDING') {
                    //   return {
                    //     dashboard : {
                    //       ...prev.dashboard,
                    //       pending : {
                    //         count : prev.dashboard.pending.count - 1,
                    //       },
                    //     },
                    //   };
                    // }

                    if (newDoc.state === 'OPEN') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          open : {
                            count : prev.dashboard.open.count - 1,
                          },
                        },
                      };
                    }

                    if (newDoc.state === 'CLOSED') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          closed : {
                            count : prev.dashboard.closed.count - 1,
                          },
                        },
                      };
                    }

                    if (newDoc.state === 'CANCELED') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          canceled : {
                            count : prev.dashboard.canceled.count - 1,
                          },
                        },
                      };
                    }

                  }

                  return prev;
                },
                // pendingDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && newDoc.state === 'PENDING') {
                //     const index = arrayFindIndex(prev.pendingDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.pendingDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.pendingDashboard.docs
                //       ];
                //
                //     return {
                //       pendingDashboard : {
                //         length : prev.pendingDashboard.length - 1,
                //         cursor : prev.pendingDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                // morePendingDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && newDoc.state === 'PENDING') {
                //     const index = arrayFindIndex(prev.pendingDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.pendingDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.pendingDashboard.docs
                //       ];
                //
                //     return {
                //       pendingDashboard : {
                //         cursor : prev.pendingDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                openDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.closeDoc.doc;

                  if (prev && newDoc && newDoc.state === 'OPEN') {
                    const index = arrayFindIndex(prev.openDashboard.docs, (id) => newDoc.id === id);
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

                  return prev;
                },
                moreOpenDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.closeDoc.doc;

                  if (prev && newDoc && newDoc.state === 'OPEN') {
                    const index = arrayFindIndex(prev.openDashboard.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.openDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.openDashboard.docs
                      ];

                    return {
                      openDashboard : {
                        cursor : prev.openDashboard.cursor - 1,
                        docs,
                      },
                    };
                  }

                  return prev;
                },
                // closedDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && (newDoc.state === 'CLOSED' || newDoc.state === 'CANCELED')) {
                //     const index = arrayFindIndex(prev.closedDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.closedDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.closedDashboard.docs
                //       ];
                //
                //     return {
                //       openDashboard : {
                //         length : prev.closedDashboard.length - 1,
                //         cursor : prev.closedDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                // moreClosedDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && (newDoc.state === 'CLOSED' || newDoc.state === 'CANCELED')) {
                //     const index = arrayFindIndex(prev.closedDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.closedDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.closedDashboard.docs
                //       ];
                //
                //     return {
                //       openDashboard : {
                //         cursor : prev.closedDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                recentDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.cancelDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.docs
                      ];
                    return {
                      docs,
                    };
                  }

                  return prev;
                },
                // getTimeline(prev, { mutationResult, queryVariables }) {
                //   const newDoc = mutationResult.data.closeDoc.doc;
                //
                //   const newActivities = mutationResult.data.closeDoc.activities;
                //
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
                getDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.closeDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.getDocs.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.getDocs.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.getDocs.docs
                      ];

                    return {
                      getDocs : {
                        cursor : prev.getDocs.cursor - 1,
                        length : prev.getDocs.length - 1,
                        docs,
                      },
                    };
                  }

                  return prev;
                },
                moreDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.closeDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.getDocs.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.getDocs.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.getDocs.docs
                      ];

                    return {
                      getDocs : {
                        cursor : prev.getDocs.cursor - 1,
                        docs,
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
                default:
                  onError(`Erreur inconnu, veuillez réessayer à nouveau.`);
              }
            } else {
              self.setState({ busyAction : false });
              self.context.snackbar.show({
                message  : 'Succès',
                duration : 7 * 1000,
                action   : {
                  title : 'Annuler l\'annulation',
                  click : function () {
                    this.dismiss();
                    setTimeout(() => {
                      raf(() => {
                        undoClosure();
                      });
                    }, 0);
                  },
                },
              });
            }
          });

        },
      });
    }
  }
  onCancel() {
    const self = this;
    const { doc } = self.props;
    if (doc) {
      toastr.confirm(CONFIRM_MSG, {
        cancelText : 'Non',
        okText     : 'Oui',
        onOk       : () => {
          self.setState({
            busyAction : true,
          }, async () => {

            async function undoCancelation() {

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

            const { data: { cancelDoc: { error } } } = await self.props.client.mutate({
              refetchQueries : ['getDoc', 'timeline'],
              mutation  : CANCEL_MUTATION,
              variables : { id : doc.id },
              updateQueries : {
                dashboard(prev, { mutationResult }) {
                  const newDoc = mutationResult.data.cancelDoc.doc;

                  if (prev && newDoc) {
                    // if (newDoc.state === 'PENDING') {
                    //   return {
                    //     dashboard : {
                    //       ...prev.dashboard,
                    //       pending : {
                    //         count : prev.dashboard.pending.count - 1,
                    //       },
                    //     },
                    //   };
                    // }

                    if (newDoc.state === 'OPEN') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          open : {
                            count : prev.dashboard.open.count - 1,
                          },
                        },
                      };
                    }

                    if (newDoc.state === 'CLOSED') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          closed : {
                            count : prev.dashboard.closed.count - 1,
                          },
                        },
                      };
                    }

                    if (newDoc.state === 'CANCELED') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          canceled : {
                            count : prev.dashboard.canceled.count - 1,
                          },
                        },
                      };
                    }

                  }

                  return prev;
                },
                // pendingDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && newDoc.state === 'PENDING') {
                //     const index = arrayFindIndex(prev.pendingDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.pendingDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.pendingDashboard.docs
                //       ];
                //
                //     return {
                //       pendingDashboard : {
                //         length : prev.pendingDashboard.length - 1,
                //         cursor : prev.pendingDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                // morePendingDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && newDoc.state === 'PENDING') {
                //     const index = arrayFindIndex(prev.pendingDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.pendingDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.pendingDashboard.docs
                //       ];
                //
                //     return {
                //       pendingDashboard : {
                //         cursor : prev.pendingDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                openDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.cancelDoc.doc;

                  if (prev && newDoc && newDoc.state === 'OPEN') {
                    const index = arrayFindIndex(prev.openDashboard.docs, (id) => newDoc.id === id);
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

                  return prev;
                },
                moreOpenDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.cancelDoc.doc;

                  if (prev && newDoc && newDoc.state === 'OPEN') {
                    const index = arrayFindIndex(prev.openDashboard.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.openDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.openDashboard.docs
                      ];

                    return {
                      openDashboard : {
                        cursor : prev.openDashboard.cursor - 1,
                        docs,
                      },
                    };
                  }

                  return prev;
                },
                // closedDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && (newDoc.state === 'CLOSED' || newDoc.state === 'CANCELED')) {
                //     const index = arrayFindIndex(prev.closedDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.closedDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.closedDashboard.docs
                //       ];
                //
                //     return {
                //       openDashboard : {
                //         length : prev.closedDashboard.length - 1,
                //         cursor : prev.closedDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                // moreClosedDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && (newDoc.state === 'CLOSED' || newDoc.state === 'CANCELED')) {
                //     const index = arrayFindIndex(prev.closedDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.closedDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.closedDashboard.docs
                //       ];
                //
                //     return {
                //       openDashboard : {
                //         cursor : prev.closedDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                recentDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.cancelDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.docs
                      ];
                    return {
                      docs,
                    };
                  }

                  return prev;
                },
                // getTimeline(prev, { mutationResult, queryVariables }) {
                //   const newDoc = mutationResult.data.cancelDoc.doc;
                //
                //   const newActivities = mutationResult.data.cancelDoc.activities;
                //
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
                getDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.cancelDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.getDocs.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.getDocs.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.getDocs.docs
                      ];

                    return {
                      getDocs : {
                        cursor : prev.getDocs.cursor - 1,
                        length : prev.getDocs.length - 1,
                        docs,
                      },
                    };
                  }

                  return prev;
                },
                moreDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = mutationResult.data.cancelDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.getDocs.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.getDocs.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.getDocs.docs
                      ];

                    return {
                      getDocs : {
                        cursor : prev.getDocs.cursor - 1,
                        docs,
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
                default:
                  onError(`Erreur inconnu, veuillez réessayer à nouveau.`);
              }
            } else {
              self.setState({ busyAction : false });
              self.context.snackbar.show({
                message  : 'Succès',
                duration : 7 * 1000,
                action   : {
                  title : 'Annuler l\'annulation',
                  click : function () {
                    this.dismiss();
                    setTimeout(() => {
                      raf(() => {
                        undoCancelation();
                      });
                    }, 0);
                  },
                },
              });
            }
          });

        },
      });
    }
  }
  onDeleteOrRestoreDoc() {
    const self = this;
    const { doc } = self.props;
    if (doc) {
      toastr.confirm(CONFIRM_MSG, {
        cancelText : 'Non',
        okText     : 'Oui',
        onOk       : () => {
          const isDeletion = !doc.deletion;
          self.setState({
            busyAction : true,
          }, async () => {

            async function undoDeletion() {

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

            const { data: { [isDeletion ? 'delDoc' : 'restoreDoc']: { error } } } = await self.props.client.mutate({
              refetchQueries : ['getDoc', 'invalidDocs', 'unpaidDocs', 'openDocs', 'timeline'],
              mutation  : isDeletion ? DEL_MUTATION : RESTORE_MUTATION,
              variables : { id : doc.id },
              updateQueries : {
                dashboard(prev, { mutationResult }) {
                  const newDoc = isDeletion
                    ? mutationResult.data.delDoc.doc
                    : mutationResult.data.restoreDoc.doc;

                  if (prev && newDoc) {
                    // if (newDoc.state === 'PENDING') {
                    //   return {
                    //     dashboard : {
                    //       ...prev.dashboard,
                    //       pending : {
                    //         count : prev.dashboard.pending.count - 1,
                    //       },
                    //     },
                    //   };
                    // }

                    if (newDoc.state === 'OPEN') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          open : {
                            count : prev.dashboard.open.count - 1,
                          },
                        },
                      };
                    }

                    if (newDoc.state === 'CLOSED') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          closed : {
                            count : prev.dashboard.closed.count - 1,
                          },
                        },
                      };
                    }

                    if (newDoc.state === 'CANCELED') {
                      return {
                        dashboard : {
                          ...prev.dashboard,
                          canceled : {
                            count : prev.dashboard.canceled.count - 1,
                          },
                        },
                      };
                    }

                  }

                  return prev;
                },
                // pendingDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && newDoc.state === 'PENDING') {
                //     const index = arrayFindIndex(prev.pendingDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.pendingDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.pendingDashboard.docs
                //       ];
                //
                //     return {
                //       pendingDashboard : {
                //         length : prev.pendingDashboard.length - 1,
                //         cursor : prev.pendingDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                // morePendingDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && newDoc.state === 'PENDING') {
                //     const index = arrayFindIndex(prev.pendingDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.pendingDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.pendingDashboard.docs
                //       ];
                //
                //     return {
                //       pendingDashboard : {
                //         cursor : prev.pendingDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                openDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = isDeletion
                    ? mutationResult.data.delDoc.doc
                    : mutationResult.data.restoreDoc.doc;

                  if (prev && newDoc && newDoc.state === 'OPEN') {
                    const index = arrayFindIndex(prev.openDashboard.docs, (id) => newDoc.id === id);
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

                  return prev;
                },
                moreOpenDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = isDeletion
                    ? mutationResult.data.delDoc.doc
                    : mutationResult.data.restoreDoc.doc;

                  if (prev && newDoc && newDoc.state === 'OPEN') {
                    const index = arrayFindIndex(prev.openDashboard.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.openDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.openDashboard.docs
                      ];

                    return {
                      openDashboard : {
                        cursor : prev.openDashboard.cursor - 1,
                        docs,
                      },
                    };
                  }

                  return prev;
                },
                // closedDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && (newDoc.state === 'CLOSED' || newDoc.state === 'CANCELED')) {
                //     const index = arrayFindIndex(prev.closedDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.closedDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.closedDashboard.docs
                //       ];
                //
                //     return {
                //       openDashboard : {
                //         length : prev.closedDashboard.length - 1,
                //         cursor : prev.closedDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                // moreClosedDocs(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   if (prev && newDoc && (newDoc.state === 'CLOSED' || newDoc.state === 'CANCELED')) {
                //     const index = arrayFindIndex(prev.closedDashboard.docs, (id) => newDoc.id === id);
                //     const docs = index !== -1
                //       ? prev.closedDashboard.docs.filter((doc) => doc.id !== newDoc.id)
                //       : [
                //         ...prev.closedDashboard.docs
                //       ];
                //
                //     return {
                //       openDashboard : {
                //         cursor : prev.closedDashboard.cursor - 1,
                //         docs,
                //       },
                //     };
                //   }
                //
                //   return prev;
                // },
                recentDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = isDeletion
                    ? mutationResult.data.delDoc.doc
                    : mutationResult.data.restoreDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.docs
                      ];
                    return {
                      docs,
                    };
                  }

                  return prev;
                },
                // getTimeline(prev, { mutationResult, queryVariables }) {
                //   const newDoc = isDeletion
                //     ? mutationResult.data.delDoc.doc
                //     : mutationResult.data.restoreDoc.doc;
                //
                //   const newActivities = isDeletion
                //     ? mutationResult.data.delDoc.activities
                //     : mutationResult.data.restoreDoc.activities;
                //
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
                getDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = isDeletion
                    ? mutationResult.data.delDoc.doc
                    : mutationResult.data.restoreDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.getDocs.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.getDocs.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.getDocs.docs
                      ];

                    return {
                      getDocs : {
                        cursor : prev.getDocs.cursor - 1,
                        length : prev.getDocs.length - 1,
                        docs,
                      },
                    };
                  }

                  return prev;
                },
                moreDocs(prev, { mutationResult, queryVariables }) {
                  const newDoc = isDeletion
                    ? mutationResult.data.delDoc.doc
                    : mutationResult.data.restoreDoc.doc;

                  if (prev && newDoc) {
                    const index = arrayFindIndex(prev.getDocs.docs, (id) => newDoc.id === id);
                    const docs = index !== -1
                      ? prev.getDocs.docs.filter((doc) => doc.id !== newDoc.id)
                      : [
                        ...prev.getDocs.docs
                      ];

                    return {
                      getDocs : {
                        cursor : prev.getDocs.cursor - 1,
                        docs,
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
                default:
                  onError(`Erreur inconnu, veuillez réessayer à nouveau.`);
              }
            } else {
              self.setState({ busyAction : false });
              self.context.snackbar.show({
                message  : 'Succès',
                duration : 7 * 1000,
                action   : isDeletion ? {
                  title : 'Annuler la suppression',
                  click : function () {
                    this.dismiss();
                    setTimeout(() => {
                      raf(() => {
                        undoDeletion();
                      });
                    }, 0);
                  },
                } : null,
              });
            }
          });

        },
      });
    }
  }
  render() {
    const { intl, user, doc, loading } = this.props;
    return (
      <div className={cx(style.overview, loading ? undefined : (doc.deletion && style.deletedDoc))}>
        <div className={cx(style.overviewContent, style.card)}>

          <div className={style.docTitle}>
            <h6 style={{ display : 'flex' }} className={style.h6}>
              {loading ? null : [
                <div className={style.docRefNo}>
                  Dossier {doc.refNo}
                </div>,
                <div onClick={this.copyKeyToClipboard} className={style.docKeyBadge}>
                  {doc.key}
                </div>
              ]}
            </h6>
            <h4 className={style.h4}>
              {loading ? null : `${doc.vehicle.model || doc.vehicle.manufacturer}, ${doc.vehicle.plateNumber}`}
            </h4>
            <div className={style.deleteOrRestoreDocAction}>
              {(() => {
                if (loading) {
                  return null;
                }

                if (this.state.busyAction) {
                  return (
                    <ActivityIndicator size='large'/>
                  );
                }

                if (doc.deletion) {
                  return (
                    <Button onClick={this.onDeleteOrRestoreDoc} className={style.deleteOrRestoreDocButton} role='button'>
                      <UndoIcon size={32}/>
                    </Button>
                  );
                }

                return (
                  <DocMenu
                    busy={this.busy}
                    onClose={this.onClose}
                    onCancel={this.onCancel}
                    onDelete={this.onDeleteOrRestoreDoc}
                    user={user}
                    doc={doc}
                  />
                );
              })()}
            </div>
          </div>

          <div className={style.docContent}>
            {/* <RefLine */}
              {/*   loading={loading} */}
              {/*   doc={doc} */}
              {/* /> */}
            <StateLine
              loading={loading}
              doc={doc}
              user={user}
            />
            {/* <VehicleLine */}
              {/*   loading={loading} */}
              {/*   doc={doc} */}
              {/* /> */}
            {user.isAdmin ? <ManagerLine
              loading={loading}
              doc={doc}
            /> : null}
            <ClientLine
              label='Assureur'
              loading={loading}
              doc={doc}
            />
            <AgentLine
              loading={loading}
              doc={doc}
            />
            {/* <DTClosureLine */}
              {/*   loading={loading} */}
              {/*   doc={doc} */}
              {/* /> */}
            <DTSinisterLine
              loading={loading}
              doc={doc}
            />
            <DTMissionLine
              loading={loading}
              doc={doc}
            />
            <DTValidationLine
              loading={loading}
              doc={doc}
              currentUser={user}
            />
            <MTRapportsLine
              loading={loading}
              doc={doc}
              currentUser={user}
            />
            {(() => {
              if (loading) {
                return (
                  null
                );
              }

              return user.isAdmin || user.isManager(doc) ? (
                <Payment
                  loading={false}
                  doc={doc}
                  currentUser={user}
                />
              ) : null;
            })()}
            <LastActivityLine
              loading={loading}
              doc={doc}
            />
            {(() => {
              if (loading || (doc && !doc.deletion)) {
                return null;
              }

              if (user.isAdmin || user.isManager(doc)) {
                return (
                  <DeletionLine
                    loading={loading}
                    doc={doc}
                  />
                );
              }

              return null;
            })()}
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(null, mapDispatchToProps);

export default compose(
  injectIntl,
  withApollo,
  Connect,
  DataLoader.doc,
)(Overview);

