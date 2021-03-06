import React, { Component } from 'react';
import T from 'prop-types';
import ReactDOM from 'react-dom';
import shallowEqual from 'shallowEqual';
import transitions from '../styles/transitions';
import EnhancedTextarea from './EnhancedTextarea';
import TextFieldHint from './TextFieldHint';
import TextFieldLabel from './TextFieldLabel';
import TextFieldUnderline from './TextFieldUnderline';
import warning from 'warning';
import objectAssign from 'object-assign';

const getStyles = (props, context, state) => {
  const {
    baseTheme,
    textField: {
      floatingLabelColor,
      focusColor,
      textColor,
      disabledTextColor,
      backgroundColor,
      errorColor,
    },
  } = context.muiTheme;

  const styles = {
    root: {
      fontSize: 16,
      lineHeight: '24px',
      width: props.fullWidth ? '100%' : 256,
      height: (props.rows - 1) * 24 + (props.floatingLabelText ? 72 : 48),
      display: 'inline-block',
      position: 'relative',
      backgroundColor: backgroundColor,
      fontFamily: baseTheme.fontFamily,
      transition: transitions.easeOut('200ms', 'height'),
      cursor: props.disabled ? 'not-allowed' : 'auto',
    },
    error: {
      position: 'relative',
      bottom: 2,
      fontSize: 12,
      lineHeight: '12px',
      color: errorColor,
      transition: transitions.easeOut(),
    },
    floatingLabel: {
      color: props.disabled ? disabledTextColor : floatingLabelColor,
      pointerEvents: 'none',
    },
    input: {
      padding: 0,
      position: 'relative',
      width: '100%',
      border: 'none',
      outline: 'none',
      backgroundColor: 'rgba(0,0,0,0)',
      color: props.disabled ? disabledTextColor : textColor,
      cursor: 'inherit',
      font: 'inherit',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated style).
    },
    inputNative: {
      appearance: 'textfield', // Improve type search style.
    },
  };

  styles.textarea = objectAssign({}, styles.input, {
    marginTop: props.floatingLabelText ? 36 : 12,
    marginBottom: props.floatingLabelText ? -36 : -12,
    boxSizing: 'border-box',
    font: 'inherit',
  });

  // Do not assign a height to the textarea as he handles it on his own.
  styles.input.height = '100%';

  if (state.isFocused) {
    styles.floatingLabel.color = focusColor;
  }

  if (props.floatingLabelText) {
    styles.input.boxSizing = 'border-box';

    if (!props.multiLine) {
      styles.input.marginTop = 14;
    }

    if (state.errorText) {
      styles.error.bottom = !props.multiLine ? styles.error.fontSize + 3 : 3;
    }
  }

  if (state.errorText) {
    if (state.isFocused) {
      styles.floatingLabel.color = styles.error.color;
    }
  }

  return styles;
};

/**
 * Check if a value is valid to be displayed inside an input.
 *
 * @param The value to check.
 * @returns True if the string provided is valid, false otherwise.
 */
function isValid(value) {
  return (
    value !== '' &&
    value !== undefined &&
    value !== null &&
    !(Array.isArray(value) && value.length === 0)
  );
}

class TextField extends Component {
  static propTypes = {
    children: T.node,
    /**
     * The css class name of the root element.
     */
    className: T.string,
    /**
     * The text string to use for the default value.
     */
    defaultValue: T.any,
    /**
     * Disables the text field if set to true.
     */
    disabled: T.bool,
    /**
     * The style object to use to override error styles.
     */
    errorStyle: T.object,
    /**
     * The error content to display.
     */
    errorText: T.node,
    /**
     * If true, the floating label will float even when there is no value.
     */
    floatingLabelFixed: T.bool,
    /**
     * The style object to use to override floating label styles when focused.
     */
    floatingLabelFocusStyle: T.object,
    /**
     * The style object to use to override floating label styles when shrunk.
     */
    floatingLabelShrinkStyle: T.object,
    /**
     * The style object to use to override floating label styles.
     */
    floatingLabelStyle: T.object,
    /**
     * The content to use for the floating label element.
     */
    floatingLabelText: T.node,
    /**
     * If true, the field receives the property width 100%.
     */
    fullWidth: T.bool,
    /**
     * Override the inline-styles of the TextField's hint text element.
     */
    hintStyle: T.object,
    /**
     * The hint content to display.
     */
    hintText: T.node,
    /**
     * The id prop for the text field.
     */
    id: T.string,
    /**
     * Override the inline-styles of the TextField's input element.
     * When multiLine is false: define the style of the input element.
     * When multiLine is true: define the style of the container of the textarea.
     */
    inputStyle: T.object,
    /**
     * If true, a textarea element will be rendered.
     * The textarea also grows and shrinks according to the number of lines.
     */
    multiLine: T.bool,
    /**
     * Name applied to the input.
     */
    name: T.string,
    /** @ignore */
    onBlur: T.func,
    /**
     * Callback function that is fired when the textfield's value changes.
     *
     * @param {object} event Change event targeting the text field.
     * @param {string} newValue The new value of the text field.
     */
    onChange: T.func,
    /** @ignore */
    onFocus: T.func,
    /**
     * Number of rows to display when multiLine option is set to true.
     */
    rows: T.number,
    /**
     * Maximum number of rows to display when
     * multiLine option is set to true.
     */
    rowsMax: T.number,
    /**
     * Override the inline-styles of the root element.
     */
    style: T.object,
    /**
     * Override the inline-styles of the TextField's textarea element.
     * The TextField use either a textarea or an input,
     * this property has effects only when multiLine is true.
     */
    textareaStyle: T.object,
    /**
     * Specifies the type of input to display
     * such as 'password' or 'text'.
     */
    type: T.string,
    /**
     * Override the inline-styles of the
     * TextField's underline element when disabled.
     */
    underlineDisabledStyle: T.object,
    /**
     * Override the inline-styles of the TextField's
     * underline element when focussed.
     */
    underlineFocusStyle: T.object,
    /**
     * If true, shows the underline for the text field.
     */
    underlineShow: T.bool,
    /**
     * Override the inline-styles of the TextField's underline element.
     */
    underlineStyle: T.object,
    /**
     * The value of the text field.
     */
    value: T.any,
  };

  static defaultProps = {
    disabled: false,
    floatingLabelFixed: false,
    multiLine: false,
    fullWidth: false,
    type: 'text',
    underlineShow: true,
    rows: 1,
  };

  static contextTypes = {
    muiTheme: T.object.isRequired,
  };

  state = {
    isFocused: false,
    errorText: undefined,
    hasValue: false,
  };

  componentWillMount() {
    const { children, name, hintText, floatingLabelText, id } = this.props;

    const propsLeaf = children ? children.props : this.props;

    this.setState({
      errorText: this.props.errorText,
      hasValue: isValid(propsLeaf.value) || isValid(propsLeaf.defaultValue),
    });

    warning(
      name || hintText || floatingLabelText || id,
      `Material-UI: We don't have enough information
      to build a robust unique id for the TextField component. Please provide an id or a name.`,
    );

    const uniqueId = Math.floor(Math.random() * 0xffff);
    this.uniqueId = uniqueId;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errorText !== this.props.errorText) {
      this.setState({
        errorText: nextProps.errorText,
      });
    }

    if (nextProps.children && nextProps.children.props) {
      nextProps = nextProps.children.props;
    }

    if (nextProps.hasOwnProperty('value')) {
      const hasValue = isValid(nextProps.value);

      this.setState({
        hasValue: hasValue,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context, nextContext)
    );
  }

  blur() {
    if (this.input) {
      this.getInputNode().blur();
    }
  }

  focus() {
    if (this.input) {
      this.getInputNode().focus();
    }
  }

  select() {
    if (this.input) {
      this.getInputNode().select();
    }
  }

  getValue() {
    return this.input ? this.getInputNode().value : undefined;
  }

  getInputNode() {
    return this.props.children || this.props.multiLine
      ? this.input.getInputNode()
      : ReactDOM.findDOMNode(this.input);
  }

  handleInputBlur = event => {
    this.setState({ isFocused: false });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  handleInputChange = event => {
    if (!this.props.hasOwnProperty('value')) {
      this.setState({ hasValue: isValid(event.target.value) });
    }
    if (this.props.onChange) {
      this.props.onChange(event, event.target.value);
    }
  };

  handleInputFocus = event => {
    if (this.props.disabled) {
      return;
    }
    this.setState({ isFocused: true });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleHeightChange = (event, height) => {
    let newHeight = height + 24;
    if (this.props.floatingLabelText) {
      newHeight += 24;
    }
    ReactDOM.findDOMNode(this).style.height = `${newHeight}px`;
  };

  _isControlled() {
    return this.props.hasOwnProperty('value');
  }

  render() {
    const {
      children,
      className,
      disabled,
      errorStyle,
      errorText, // eslint-disable-line no-unused-vars
      floatingLabelFixed,
      floatingLabelFocusStyle,
      floatingLabelShrinkStyle,
      floatingLabelStyle,
      floatingLabelText,
      fullWidth, // eslint-disable-line no-unused-vars
      hintText,
      hintStyle,
      id,
      inputStyle,
      multiLine,
      onBlur, // eslint-disable-line no-unused-vars
      onChange, // eslint-disable-line no-unused-vars
      onFocus, // eslint-disable-line no-unused-vars
      style,
      type,
      underlineDisabledStyle,
      underlineFocusStyle,
      underlineShow,
      underlineStyle,
      rows,
      rowsMax,
      textareaStyle,
      ...other
    } = this.props;

    const { prepareStyles } = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);
    const inputId = id || this.uniqueId;

    const errorTextElement =
      this.state.errorText &&
      <div style={prepareStyles(objectAssign(styles.error, errorStyle))}>
        {this.state.errorText}
      </div>;

    const floatingLabelTextElement =
      floatingLabelText &&
      <TextFieldLabel
        muiTheme={this.context.muiTheme}
        style={objectAssign(
          styles.floatingLabel,
          floatingLabelStyle,
          this.state.isFocused ? floatingLabelFocusStyle : null,
        )}
        shrinkStyle={floatingLabelShrinkStyle}
        htmlFor={inputId}
        shrink={
          this.state.hasValue || this.state.isFocused || floatingLabelFixed
        }
        disabled={disabled}
      >
        {floatingLabelText}
      </TextFieldLabel>;

    const inputProps = {
      id: inputId,
      ref: elem => (this.input = elem),
      disabled: this.props.disabled,
      onBlur: this.handleInputBlur,
      onChange: this.handleInputChange,
      onFocus: this.handleInputFocus,
    };

    const childStyleMerged = objectAssign(styles.input, inputStyle);

    let inputElement;
    if (children) {
      inputElement = React.cloneElement(children, {
        ...inputProps,
        ...children.props,
        style: objectAssign(childStyleMerged, children.props.style),
      });
    } else {
      inputElement = multiLine
        ? <EnhancedTextarea
            style={childStyleMerged}
            textareaStyle={objectAssign(
              styles.textarea,
              styles.inputNative,
              textareaStyle,
            )}
            rows={rows}
            rowsMax={rowsMax}
            hintText={hintText}
            {...other}
            {...inputProps}
            onHeightChange={this.handleHeightChange}
          />
        : <input
            type={type}
            style={prepareStyles(
              objectAssign(styles.inputNative, childStyleMerged),
            )}
            {...other}
            {...inputProps}
          />;
    }

    let rootProps = {};

    if (children) {
      rootProps = other;
    }

    return (
      <div
        {...rootProps}
        className={className}
        style={prepareStyles(objectAssign(styles.root, style))}
      >
        {floatingLabelTextElement}
        {hintText
          ? <TextFieldHint
              muiTheme={this.context.muiTheme}
              show={
                !(
                  this.state.hasValue ||
                  (floatingLabelText && !this.state.isFocused)
                ) ||
                (!this.state.hasValue &&
                  floatingLabelText &&
                  floatingLabelFixed &&
                  !this.state.isFocused)
              }
              style={hintStyle}
              text={hintText}
            />
          : null}
        {inputElement}
        {underlineShow
          ? <TextFieldUnderline
              disabled={disabled}
              disabledStyle={underlineDisabledStyle}
              error={!!this.state.errorText}
              errorStyle={errorStyle}
              focus={this.state.isFocused}
              focusStyle={underlineFocusStyle}
              muiTheme={this.context.muiTheme}
              style={underlineStyle}
            />
          : null}
        {errorTextElement}
      </div>
    );
  }
}

export default TextField;
