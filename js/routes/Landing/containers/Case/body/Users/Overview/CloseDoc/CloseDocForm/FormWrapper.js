import React, { PropTypes as T } from 'react'
import {compose} from 'redux';
import {connect} from 'react-redux';

import { withApollo } from 'react-apollo';

import isEmpty from 'isEmpty';

import { createSelector } from 'utils/reselect';

import arrayFindIndex from 'array-find-index';

import * as codes from 'result-codes';

import style from 'routes/Landing/styles';

import Zoom from 'components/transitions/Zoom';

import Button from 'components/bootstrap/Button';

import raf from 'utils/requestAnimationFrame';

import { CloseIcon } from 'components/icons/MaterialIcons';

import validations from './validations';

import { PATH_CASES_CASE } from 'vars';

import { SubmissionError, isDirty } from 'redux-form/immutable';

import MUTATION from './closeDoc.mutation.graphql';

// import { toastr } from 'containers/Toastr';

import Form from './Form';

import Title from './Title';
import Actions from './Actions';

const styles = {
  body : {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 2.25rem',
  },
  wrapper : {
    position: 'relative',
    zIndex: 1077,
    height: '100%',
    width: '100%',
    overflowY: 'auto',
  },
  confirmToastr : {},
};

// const CONFIRM_MSG = <div style={style.confirmToastr}>
//   <h5>Voulez-vous quitter?</h5>
//   <div>
//     Les modifications que vous avez effectuées peuvent ne pas être sauvegardées.
//   </div>
// </div>;

class FormWrapper extends React.Component {
  static displayName = 'CloseDocFormWrapper';

  static contextTypes = {
    store : T.object.isRequired,
    snackbar: T.shape({
      show: T.func.isRequired,
    }),
  };

  static propTypes = {
    client          : T.shape({
      mutate: T.func.isRequired,
    }),

  };

  constructor(props) {
    super(props);

    this.onSubmit  = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);

    this.state = {
      show : props.closingDoc,
    };
  }
  onTransitionEnd() {
    if (this.applyTransitionEnd) {
      this.applyTransitionEnd();
      this.applyTransitionEnd = null;
    }
  }
  onClose() {
    // const { dirty } = this.props;
    const self = this;

    function doClose() {
      self.applyTransitionEnd = () => {
        setTimeout(() => {
          raf(() => {
            self.props.closePortal();
          })
        }, 0);
      };

      self.setState({
        show : false,
      });
    }

    // if (dirty) {
    //   toastr.confirm(CONFIRM_MSG, {
    //     onOk : doClose,
    //   });
    // } else {
    doClose();
    // }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.show === true && nextProps.closingDoc === false) {
      this.setState({
        show : false,
      });
    } else if (this.state.show === false && nextProps.closingDoc === true) {
      this.setState({
        show : true,
      });
    }
  }

  async onSubmit(data) {
    const self = this;

    try {
      await validations.asyncValidate(data);
    } catch (e) {
      throw new SubmissionError(e);
    }

    const { closePortal, doc } = self.props;

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

    const info = {
      dateClosure       : data.get('dateClosure'),
      mtRapports        : data.get('mtRapports'),
      // dateValidation    : data.get('dateValidation'),
      paymentAmount     : data.get('paymentAmount'),
      paymentDate       : data.get('paymentDate'),
    };

    const { data: { closeDoc: { errors, error } } } = await self.props.client.mutate({
      refetchQueries : ['getDoc', 'unpaidDocs', 'getTimeline'],
      mutation  : MUTATION,
      variables : { id : doc.id, info },
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
          const newDoc = mutationResult.data.closeDoc.doc;

          if (prev && newDoc) {
            const index = arrayFindIndex(prev.recentDocs, (id) => newDoc.id === id);
            const recentDocs = index !== -1
              ? prev.recentDocs.filter((doc) => doc.id !== newDoc.id)
              : [
                ...prev.recentDocs
              ];
            return {
              recentDocs : [
                newDoc,
                ...recentDocs,
              ],
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

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }

    if (error) {
      switch (error.code) {
        case codes.ERROR_ACCOUNT_NOT_VERIFIED:
        case codes.ERROR_NOT_AUTHORIZED:
          throw new SubmissionError({
            _error : `Vous n'êtes pas authorisé`,
          });
        default:
          throw new SubmissionError({
            _error : 'Erreur inconnu, veuillez réessayer à nouveau.',
          });
      }
    } else {
      // close form
      closePortal();

      const { snackbar } = self.context;
      if (snackbar) {
        snackbar.show({
          message  : 'Succès',
          duration : 7 * 1000,
          // action   : {
          //   title : 'Annuler la clôture',
          //   click : function () {
          //     this.dismiss();
          //     setTimeout(() => {
          //       raf(() => {
          //         undoClosure();
          //       });
          //     }, 0);
          //   },
          // },
        });
      }
    }

  }
  render() {
    const { closingDoc, ...props } = this.props;

    return (
      <Zoom onTransitionEnd={this.onTransitionEnd} in={this.state.show} timeout={75} transitionAppear>
        <div className={style.closeDocFormWrapper}>
          <div className={style.closeDocFormMask}></div>
          <div style={styles.wrapper}>
            <div className={style.closeDocFormInner}>
              <div className={style.closeDocForm}>
                <Title doc={props.doc}/>
                {closingDoc ? <Form {...props} onSubmit={this.onSubmit} /> : null}
              </div>
            </div>
            <Actions />
          </div>
          <div className={style.closeDocFormClose}>
            <Button onClick={this.onClose} className={style.closeDocFormCloseButton} role='button'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CloseIcon size={24}/>
              </div>
            </Button>
          </div>
        </div>
      </Zoom>
    );

  }
}

const Connect = connect((state) => ({
  dirty : isDirty('closeDoc')(state),
}));

export default compose(
  withApollo,
  Connect,
)(FormWrapper);

