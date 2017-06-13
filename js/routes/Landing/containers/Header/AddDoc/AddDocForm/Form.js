import React, { PropTypes as T } from 'react'

import {compose} from 'redux';
import { connect } from 'react-redux';

import getActiveElement from 'getActiveElement';

import style from 'routes/Landing/styles';

import moment from 'moment';

import focusNode from 'focusNode';
import raf from 'requestAnimationFrame';

import validations from './validations';

import { ErrorIcon } from 'components/icons/MaterialIcons';

import selector from './selector';

import { SubmissionError, Field, reduxForm, submit, propTypes as formPropTypes } from 'redux-form/immutable';

import TextField from 'components/material-ui/TextField';

import DTMission from './DTMission';
import DTSinistre from './DTSinistre';

import Company from './Company';
import Vehicle from './Vehicle';
import Agent from './Agent';
import Client from './Client';

function parseDate(s) {
  return +moment.utc(s);
}

function renderField({ onKeyDown, label : floatingLabelText, className, input }) {
  return (
    <TextField
      className={className}
      floatingLabelText={floatingLabelText}
      onKeyDown={onKeyDown}
      {...input}
    />

  );
}

const styles = {
  body : {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 2.25rem',
    minHeight: 1125,
  },

  error : {
    lineHeight: 1.5,
    color: 'rgb(244, 67, 54)',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 35,
    padding: 16,
    border: '1px solid',
    fontWeight: 500,
    width: '80%',
  }
};

class Form extends React.Component {
  static displayName = 'AddDocForm';

  static contextTypes = {
    store : T.object.isRequired,

  };

  static propTypes = {
    ...formPropTypes,
  };

  constructor(props) {
    super(props);

    this.onKeyDown = this._onKeyDown.bind(this);
    this.onNext1 = this.onNext1.bind(this);
    this.onNext2 = this.onNext2.bind(this);
    this.onDTField = this.onDTField.bind(this);
    this.onCompanyRef = this.onCompanyRef.bind(this);
  }

  onDTField(ref) {
    this.date = ref;
  }

  onCompanyRef(ref) {
    this.companyRef = ref;
  }
  onNext1() {
    const activeElement = getActiveElement(document);
    if (!activeElement || activeElement.nodeName !== 'INPUT') {
      setTimeout(() => {
        raf(
          () => focusNode(this.date)
        );
      }, 0);
    }
  }
  onNext2() {
    const activeElement = getActiveElement(document);
    if (!activeElement || activeElement.nodeName !== 'INPUT') {
      setTimeout(() => {
        raf(
          () => focusNode(this.companyRef)
        );
      }, 0);
    }
  }

  componentDidMount() {
    this.props.asyncValidate();
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      this.context.store.dispatch(submit('addDoc'));
    }
  }

  componentWillReceiveProps(nextProps) {
  }
  render() {
    const {
      error,
      dirty,
      lang,
      onDTField,
      invalid,
      pristine,
      asyncValidate,
      closePortal,
    } = this.props;

    const fields = [
      error ? <div key='error' style={styles.error}>
        <ErrorIcon size={32}/> <div style={{marginLeft: 9}}>{error}</div>
      </div> : null,

      <section style={{display: 'flex', flexDirection: 'row'}} key='date' className={style.addDocSectionDates}>
        <Field
          name='date'
          parse={parseDate}
          props={{
            asyncValidate,
            locale    : lang,
            onKeyDown : this.onKeyDown,
            onRef     : onDTField,
            onNext    : this.onNext1,
            label     : 'DT Sinistre',
          }}
          component={DTSinistre}
        />
        <Field
          name='dateMission'
          parse={parseDate}
          props={{
            asyncValidate,
            locale    : lang,
            onRef     : this.onDTField,
            onKeyDown : this.onKeyDown,
            onNext    : this.onNext2,
            label     : 'DT Mission',
            showClock : true,
          }}
          component={DTMission}
        />
      </section>,

      <section key='company' className={style.addDocSection}>
        <Field
          name='company'
          props={{
            onKeyDown : this.onKeyDown,
            onRef     : this.onCompanyRef,
            label     : 'COMPAGNIE',
          }}
          component={Company}
        />
      </section>,

      <br/>,
      <br/>,

      <Vehicle
        key='vehicle'
        onKeyDown={this.onKeyDown}
      />,

      <br/>,
      <br/>,

      <Client
        key='client'
        onKeyDown={this.onKeyDown}
        asyncValidate={asyncValidate}
      />,

      <br/>,
      <br/>,

      <Agent
        key='agent'
        onKeyDown={this.onKeyDown}
        asyncValidate={asyncValidate}
      />,

      <br/>,
      <br/>,

      <header>
        <h5>Informations additionnelles</h5>
      </header>,

      <section style={{display: 'flex', flexDirection: 'row'}} key='last' className={style.addDocSectionDates}>
        <div>
          <Field
            name='police'
            props={{
              onKeyDown : this.onKeyDown,
              label     : 'N° Sinistre ou N° Police',
            }}
            component={renderField}
          />
        </div>
        <div>
          <Field
            name='nature'
            props={{
              onKeyDown : this.onKeyDown,
              label     : 'Nature',
            }}
            component={renderField}
          />
        </div>
      </section>,
    ];

    return (
      <div style={styles.body}>
        {fields}
      </div>

    );

  }
}

Form.propTypes = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

const WithForm = reduxForm({
  form                      : 'addDoc',
  keepDirtyOnReinitialize   : false,
  enableReinitialize        : true,
  destroyOnUnmount          : true,
  forceUnregisterOnUnmount  : true,
  asyncValidate             : validations.asyncValidate,
  // asyncBlurFields           : [
  //   'dateMission',
  //   'date',
  //
  //   'company',
  //
  //   'vehicleManufacturer',
  //   'vehicleModel',
  //   'vehiclePlateNumber',
  //
  //   'clientDisplayName',
  //   'clientEmail',
  //
  //   'agentDisplayName',
  //   'agentEmail',
  // ],
  asyncBlurFields           : validations.asyncBlurFields,
});

export default compose(
  Connect,
  WithForm,
)(Form);

