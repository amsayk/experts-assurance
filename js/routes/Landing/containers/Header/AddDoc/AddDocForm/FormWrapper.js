import React, { PropTypes as T } from 'react'
import { withRouter } from 'react-router';
import {compose} from 'redux';
import {connect} from 'react-redux';

import { withApollo } from 'react-apollo';

import isEmpty from 'isEmpty';

import { createSelector } from 'utils/reselect';

import * as codes from 'result-codes';

import style from 'routes/Landing/styles';

import Zoom from 'components/transitions/Zoom';

import Button from 'components/bootstrap/Button';

import raf from 'requestAnimationFrame';

import { CloseIcon } from 'components/icons/MaterialIcons';

import validations from './validations';

import { PATH_CASES_CASE } from 'vars';

import { SubmissionError, isDirty } from 'redux-form/immutable';

import MUTATION from './addDoc.mutation.graphql';

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
  static displayName = 'AddDocFormWrapper';

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
      show : props.addingDoc,
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
    if (this.state.show === true && nextProps.addingDoc === false) {
      this.setState({
        show : false,
      });
    } else if (this.state.show === false && nextProps.addingDoc === true) {
      this.setState({
        show : true,
      });
    }
  }

  async onSubmit(data) {
    try {
      await validations.asyncValidate(data);
    } catch (e) {
      throw new SubmissionError(e);
    }

    const { closePortal, router } = this.props;

    const { data: { addDoc: { doc, error, errors } } } = await this.props.client.mutate({
      refetchQueries : ['getTimeline', 'recentDocs'],
      mutation  : MUTATION,
      variables : { payload: {
        dateMission          : data.get('dateMission'),
        date                 : data.get('date'),

        company              : data.get('company'),

        vehicleManufacturer  : data.get('vehicleManufacturer'),
        vehicleModel         : data.get('vehicleModel'),
        vehiclePlateNumber   : data.get('vehiclePlateNumber'),
        vehicleSeries        : data.get('vehicleSeries'),
        vehicleMileage       : data.get('vehicleMileage'),
        vehicleDMC           : data.get('vehicleDMC'),
        vehicleEnergy        : data.get('vehicleEnergy'),
        vehiclePower         : data.get('vehiclePower'),

        clientId             : data.get('clientId'),
        clientKey            : data.get('clientKey'),
        clientDisplayName    : data.get('clientDisplayName'),
        clientEmail          : data.get('clientEmail'),

        agentId              : data.get('agentId'),
        agentKey             : data.get('agentKey'),
        agentDisplayName     : data.get('agentDisplayName'),
        agentEmail           : data.get('agentEmail'),

        // isOpen            : data.get('isOpen'),
      } },
      updateQueries : {
        dashboard(prev, { mutationResult }) {
          const newDoc = mutationResult.data.addDoc.doc;

          if (prev && newDoc) {
            // if (newDoc.state === 'PENDING') {
            //   return {
            //     dashboard : {
            //       ...prev.dashboard,
            //       pending : {
            //         count : prev.dashboard.pending.count + 1,
            //       },
            //     },
            //   };
            // }

            if (newDoc.state === 'OPEN') {
              return {
                dashboard : {
                  ...prev.dashboard,
                  open : {
                    count : prev.dashboard.open.count + 1,
                  },
                },
              };
            }

          }

          return prev;
        },
        // pendingDocs(prev, { mutationResult, queryVariables }) {
        //   const newDoc = mutationResult.data.addDoc.doc;
        //
        //   if (prev && newDoc && newDoc.state === 'PENDING') {
        //     const docs = [
        //       newDoc,
        //       ...prev.pendingDashboard.docs,
        //     ];
        //
        //     return {
        //       pendingDashboard : {
        //         length : prev.pendingDashboard.length + 1,
        //         cursor : prev.pendingDashboard.cursor + 1,
        //         docs,
        //       },
        //     };
        //   }
        //
        //   return prev;
        // },
        openDocs(prev, { mutationResult, queryVariables }) {
          const newDoc = mutationResult.data.addDoc.doc;

          if (prev && newDoc && newDoc.state === 'OPEN') {
            const docs = [
              newDoc,
              ...prev.openDashboard.docs,
            ];

            return {
              openDashboard : {
                length : prev.openDashboard.length + 1,
                cursor : prev.openDashboard.cursor + 1,
                docs,
              },
            };
          }

          return prev;
        },
        // recentDocs(prev, { mutationResult, queryVariables }) {
        //   const newDoc = mutationResult.data.addDoc.doc;
        //
        //   if (prev && newDoc) {
        //     return {
        //       docs : [
        //         newDoc,
        //         ...prev.docs,
        //       ],
        //     };
        //   }
        //
        //   return prev;
        // },
        // getTimeline(prev, { mutationResult, queryVariables }) {
        //   const newDoc = mutationResult.data.addDoc.doc;
        //   const newActivities = mutationResult.data.addDoc.activities;
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
          const newDoc = mutationResult.data.addDoc.doc;

          if (prev && newDoc) {
            const docs = [
              newDoc,
              ...prev.getDocs.docs,
            ];
            return {
              getDocs : {
                cursor : prev.getDocs.cursor + 1,
                length : prev.getDocs.length + 1,
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
          throw new SubmissionError({
            _error : `Vous n'êtes pas authorisé`,
          });
        default:
          throw new SubmissionError({
            _error : 'Erreur inconnu, veuillez réessayer à nouveau.',
          });
      }
    }

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }

    // close form
    closePortal();

    const { snackbar } = this.context;
    if (snackbar) {
      snackbar.show({
        message  : 'Ajouté avec succès',
        duration : 7 * 1000,
        action   : {
          title : 'Afficher',
          click : function () {
            this.dismiss();
            setTimeout(() => {
              raf(() => {
                router.push({
                  pathname : PATH_CASES_CASE + '/' + doc.id,
                });
              });
            }, 0);
          },
        },
      });
    }
  }
  render() {
    const { addingDoc, ...props } = this.props;

    return (
      <Zoom onTransitionEnd={this.onTransitionEnd} in={this.state.show} timeout={75} transitionAppear>
        <div className={style.addDocFormWrapper}>
          <div className={style.addDocFormMask}></div>
          <div style={styles.wrapper}>
            <div className={style.addDocFormInner}>
              <div className={style.addDocForm}>
                <Title/>
                {addingDoc ? <Form {...props} onSubmit={this.onSubmit} /> : null}
              </div>
            </div>
            <Actions />
          </div>
          <div className={style.addDocFormClose}>
            <Button onClick={this.onClose} className={style.addDocFormCloseButton} role='button'>
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
  dirty : isDirty('addDoc')(state),
}));

export default compose(
  withApollo,
  withRouter,
  Connect,
)(FormWrapper);

