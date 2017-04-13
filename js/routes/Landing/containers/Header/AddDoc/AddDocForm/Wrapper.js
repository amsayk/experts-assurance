import React, { PropTypes as T } from 'react'
import { withApollo } from 'react-apollo';

import {compose} from 'redux';
import { connect } from 'react-redux';

import style from 'routes/Landing/styles';

import Zoom from 'components/transitions/Zoom';

import selector from './selector';

import { SubmissionError, Field, reduxForm, propTypes as formPropTypes } from 'redux-form/immutable';

import TextField from 'components/material-ui/TextField';

// Title: Ajouter dossier {N}         fixed-top
// body 1: date
// body 2: vehicle
// body 3: client
// body 4: agent
// Actions :                          fixed-bottom

import Title from './Title';
import Actions from './Actions';


const styles = {
  body : {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 2.25rem',
  },
};

class Wrapper extends React.Component {
  static propTypes = {
    ...formPropTypes,
    client          : T.shape({
      mutate: T.func.isRequired,
    }),
    actions         : T.shape({
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.onSubmit  = this.onSubmit.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      const submit = this.props.handleSubmit(this.onSubmit);
      submit();
    }
  }

  async onSubmit(data) {
    // try {
    //   await validations.asyncValidate(data);
    // } catch (e) {
    //   throw new SubmissionError(e);
    // }
    //
    // const { intl, actions } = this.props;
    //
    // const { data: { signUp: { user, errors } } } = await this.props.client.mutate({
    //   mutation  : MUTATION,
    //   variables : { info: {
    //     email                : data.get('email'),
    //     password             : data.get('password'),
    //     passwordConfirmation : data.get('passwordConfirmation'),
    //     // recaptcha            : true,
    //   } },
    // });
    //
    // if (!isEmpty(errors)) {
    //   throw new SubmissionError(errors);
    // }
    //
    // invariant(user, '`user` must be defined at this point.');
    //
    // try {
    //   await actions.logIn(
    //     user.username, data.get('password'));
    //
    //   if (process.env.NODE_ENV !== 'production') {
    //     cookie.save('app.logIn', email, { path: '/' });
    //   }
    //
    //   // async: Notify busines info
    //   checkBusiness();
    // } catch (e) {
    //   throw new SubmissionError({ _error: intl.formatMessage(messages.error) });
    // }
  }
  componentWillReceiveProps(nextProps) {
  }
  render() {
    const { addingDoc, invalid, handleSubmit, closePortal } = this.props;

    return (
      <Zoom in={addingDoc} timeout={100} transitionAppear>
        <div className={style.addDocFormWrapper}>
          <div className={style.addDocFormMask}></div>
          <div style={{
            position: 'relative',
            zIndex: 1077,
            height: '100%',
            width: '100%',
            overflowY: 'auto',
          }}>
          <div className={style.addDocFormInner}>
            <div className={style.addDocForm}>
              <Title/>
              <div style={styles.body}>

                <section className={style.addDocSection}>
                  <TextField
                    className={style.addDocTextField}
                    autoFocus
                    floatingLabelText='DT Sinistre'/>
                </section>

                <section className={style.addDocSection}>
                  <header>
                    <h5>Vehicle</h5>
                  </header>
                  <article>
                    <TextField
                      className={style.addDocTextField}
                      floatingLabelText='Modèle'/>
                    <TextField
                      className={style.addDocTextField}
                      floatingLabelText='Immatriculation'/>
                  </article>
                </section>

                <section className={style.addDocSection}>
                  <header>
                    <h5>Client</h5>
                  </header>
                  <article>
                    <TextField
                      className={style.addDocTextField}
                      floatingLabelText='Nom complet' />
                    <TextField
                      className={style.addDocTextField}
                      floatingLabelText='Adresse e-mail'/>
                  </article>
                </section>

                <section className={style.addDocSection}>
                  <header>
                    <h5>Agent</h5>
                  </header>
                  <article>
                    <TextField
                      className={style.addDocTextField}
                      floatingLabelText='Nom complet'/>
                    <TextField
                      className={style.addDocTextField}
                      floatingLabelText='Adresse e-mail'/>
                  </article>
                </section>
              </div>
            </div>
          </div>
          <Actions
            onSave={handleSubmit(this.onSubmit)}
            onCancel={closePortal}
            invalid={invalid}
          />
        </div>
      </div>
    </Zoom>
    );

  }
}

Wrapper.propTypes = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

const WithForm = reduxForm({
  form: 'addDoc',
});

export default compose(
  withApollo,
  Connect,
  WithForm,
)(Wrapper);

