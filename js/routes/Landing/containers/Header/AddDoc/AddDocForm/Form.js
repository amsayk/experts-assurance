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

import DT from './DT';
import Vehicle from './Vehicle';
import Agent from './Agent';
import Client from './Client';
// import State from './State';

function parseDate(s) {
  return +moment.utc(s);
}

const styles = {
  body : {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 2.25rem',
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
    this.onNext = this.onNext.bind(this);
    this.onVehicleModelInput = this.onVehicleModelInput.bind(this);
  }

  onVehicleModelInput(ref) {
    this.vehicleModel = ref;
  }
  onNext() {
    const activeElement = getActiveElement(document);
    if (!activeElement || activeElement.nodeName !== 'INPUT') {
      setTimeout(() => {
        raf(
          () => focusNode(this.vehicleModel)
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
    const { error, dirty, lang, onDTField, invalid, pristine, asyncValidate, closePortal } = this.props;

    const fields = [
      error ? <div style={styles.error}>
        <ErrorIcon size={32}/> <div style={{marginLeft: 9}}>{error}</div>
      </div> : null,

      // <Field
      //   name='isOpen'
      //   component={State}
      // />,

      <section className={style.addDocSection}>
        <Field
          name='date'
          parse={parseDate}
          props={{locale : lang, onRef : onDTField, onKeyDown : this.onKeyDown, onNext: this.onNext}}
          component={DT}
        />
      </section>,

      <Vehicle
        onVehicleModelInput={this.onVehicleModelInput}
      />,

      <Client
        onKeyDown={this.onKeyDown}
        asyncValidate={asyncValidate}
      />,

      <Agent
        onKeyDown={this.onKeyDown}
        asyncValidate={asyncValidate}
      />,
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
  asyncBlurFields           : [
    'date',

    'vehicleModel',
    'vehiclePlateNumber',

    'clientDisplayName',
    'clientEmail',

    'agentDisplayName',
    'agentEmail',
  ],
});

export default compose(
  Connect,
  WithForm,
)(Form);

