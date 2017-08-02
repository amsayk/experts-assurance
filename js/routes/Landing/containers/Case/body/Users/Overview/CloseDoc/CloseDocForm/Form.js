import React from 'react';
import T from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import getActiveElement from 'getActiveElement';

import style from 'routes/Landing/styles';

import moment from 'moment';

import focusNode from 'focusNode';
import raf from 'utils/requestAnimationFrame';

import validations from './validations';

import { ErrorIcon } from 'components/icons/MaterialIcons';

import selector from './selector';

import {
  SubmissionError,
  Field,
  reduxForm,
  submit,
  propTypes as formPropTypes,
} from 'redux-form/immutable';

import TextField from 'components/material-ui/TextField';

import DT from './DT';
import Payment from './Payment';

function parseDate(s) {
  return +moment.utc(s);
}

function _parseFloat(s) {
  const val = s ? parseFloat(s) : null;
  return isNaN(val) ? null : val;
}

function getError(error, fieldName) {
  return error.get ? error.get(fieldName) || error[fieldName] : error[fieldName];
}

function renderField({
  name,
  multiLine = false,
  onKeyDown,
  floatingLabelText,
  onRef,
  className,
  input,
  meta: { touched, error },
}) {
  let errorText;

  if (error && touched) {
    errorText = getError(error, 'number')
      ? 'Veuillez entrer des chiffres valides.'
      : 'Ce champ ne peut pas être vide.';
  }

  const props = {};

  if (multiLine) {
    props.rows = 2;
    props.rowsMax = 5;
  } else {
    props.onKeyDown = onKeyDown;
  }

  return (
    <TextField
      {...props}
      ref={onRef}
      className={className}
      floatingLabelText={floatingLabelText}
      errorText={errorText}
      multiLine={multiLine}
      {...input}
    />
  );
}

const styles = {
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '0 2.25rem',
  },

  error: {
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
  },
};

class Form extends React.Component {
  static displayName = 'CloseDocForm';

  static contextTypes = {
    store: T.object.isRequired,
  };

  static propTypes = {
    ...formPropTypes,
  };

  constructor(props) {
    super(props);

    this.onKeyDown = this._onKeyDown.bind(this);
    this.onNext1 = this.onNext1.bind(this);
    this.onNext2 = this.onNext2.bind(this);
    this.onFirstChild = this.onFirstChild.bind(this);
    this.onSecondChild = this.onSecondChild.bind(this);
    this.onPaymentFirstChildRef = this.onPaymentFirstChildRef.bind(this);
  }

  onFirstChild(ref) {
    this.firstChild = ref;
  }

  onSecondChild(ref) {
    this.secondChild = ref;
  }

  onPaymentFirstChildRef(ref) {
    this.paymentFirstChild = ref;
  }
  onNext1() {
    const activeElement = getActiveElement(document);
    if (
      !activeElement &&
      activeElement.nodeName !== 'INPUT' &&
      activeElement.nodeName !== 'TEXTAREA'
    ) {
      setTimeout(() => {
        raf(() => focusNode(this.secondChild));
      }, 0);
    }
  }
  onNext2() {
    const activeElement = getActiveElement(document);
    if (
      !activeElement &&
      activeElement.nodeName !== 'INPUT' &&
      activeElement.nodeName !== 'TEXTAREA'
    ) {
      setTimeout(() => {
        raf(() => focusNode(this.paymentFirstChild));
      }, 0);
    }
  }

  componentDidMount() {
    this.props.asyncValidate();
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      this.context.store.dispatch(submit('closeDoc'));
    }
  }

  componentWillReceiveProps(nextProps) {}
  render() {
    const {
      doc,
      error,
      dirty,
      lang,
      onFirstChild,
      invalid,
      pristine,
      asyncValidate,
      submitting,
      handleSubmit,
      closePortal,
    } = this.props;

    const fields = [
      error
        ? <div key='error' style={styles.error}>
            <ErrorIcon size={32} /> <div style={{ marginLeft: 9 }}>{error}</div>
          </div>
        : null,

      <section key='dateClosure' className={style.closeSection}>
        <Field
          name='dateClosure'
          parse={parseDate}
          props={{
            asyncValidate,
            locale: lang,
            onRef: onFirstChild,
            onKeyDown: this.onKeyDown,
            onNext: this.onNext1,
            label: 'DT Validation',
          }}
          component={DT}
        />
      </section>,

      <section key='mtRapports' className={style.closeSection}>
        <Field
          name='mtRapports'
          parse={_parseFloat}
          props={{
            asyncValidate,
            onRef: this.onSecondChild,
            onKeyDown: this.onKeyDown,
            onBlur: this.onNext2,
            floatingLabelText: 'MT Rapports',
          }}
          component={renderField}
        />
      </section>,

      // <section key='dateValidation' className={style.closeSection}>
      //   <Field
      //     name='dateValidation'
      //     parse={parseDate}
      //     props={{
      //       asyncValidate,
      //       locale    : lang,
      //       onRef     : this.onSecondChild,
      //       onKeyDown : this.onKeyDown,
      //       onNext    : this.onNext2,
      //       label     : 'DT Validation',
      //     }}
      //     component={DT}
      //   />
      // </section>,

      // <section key='dateValidation' className={style.closeSection}>
      //   <Field
      //     name='dateValidation'
      //     parse={parseDate}
      //     props={{
      //       asyncValidate,
      //       locale         : lang,
      //       onKeyDown      : this.onKeyDown,
      //       onRef          : this.onFirstChild,
      //       onNext         : this.onNext2,
      //       label          : 'DT Validation',
      //       forceValidDate : false,
      //     }}
      //     component={DT}
      //   />
      // </section>,

      <div style={{ marginTop: 15 }} />,
      <div style={{ marginTop: 15 }} />,

      <Payment
        doc={doc}
        onKeyDown={this.onKeyDown}
        onPaymentFirstChildRef={this.onPaymentFirstChildRef}
        pristine={pristine}
        submitting={submitting}
        invalid={invalid}
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

Form.propTypes = {};

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

const WithForm = reduxForm({
  form: 'closeDoc',
  keepDirtyOnReinitialize: false,
  enableReinitialize: true,
  destroyOnUnmount: true,
  forceUnregisterOnUnmount: true,
  asyncValidate: validations.asyncValidate,
  validate: validations.validate,
  asyncBlurFields: validations.asyncBlurFields,
});

export default compose(Connect, WithForm)(Form);
