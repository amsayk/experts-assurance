import React from 'react';
import T from 'prop-types';
import objectAssign from 'object-assign';
import transitions from '../styles/transitions';

const propTypes = {
  /**
   * True if the parent `TextField` is disabled.
   */
  disabled: T.bool,
  /**
   * Override the inline-styles of the underline when parent `TextField` is disabled.
   */
  disabledStyle: T.object,
  /**
   * True if the parent `TextField` has an error.
   */
  error: T.bool,
  /**
   * Override the inline-styles of the underline when parent `TextField` has an error.
   */
  errorStyle: T.object,
  /**
   * True if the parent `TextField` is focused.
   */
  focus: T.bool,
  /**
   * Override the inline-styles of the underline when parent `TextField` is focused.
   */
  focusStyle: T.object,
  /**
   * @ignore
   * The material-ui theme applied to this component.
   */
  muiTheme: T.object.isRequired,
  /**
   * Override the inline-styles of the root element.
   */
  style: T.object,
};

const defaultProps = {
  disabled: false,
  disabledStyle: {},
  error: false,
  errorStyle: {},
  focus: false,
  focusStyle: {},
  style: {},
};

const TextFieldUnderline = props => {
  const {
    disabled,
    disabledStyle,
    error,
    errorStyle,
    focus,
    focusStyle,
    muiTheme,
    style,
  } = props;

  const { color: errorStyleColor } = errorStyle;

  const {
    prepareStyles,
    textField: { borderColor, disabledTextColor, errorColor, focusColor },
  } = muiTheme;

  const styles = {
    root: {
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderBottom: 'solid 1px',
      borderColor: borderColor,
      bottom: 8,
      boxSizing: 'content-box',
      margin: 0,
      position: 'absolute',
      width: '100%',
    },
    disabled: {
      borderBottom: 'dotted 2px',
      borderColor: disabledTextColor,
    },
    focus: {
      borderBottom: 'solid 2px',
      borderColor: focusColor,
      transform: 'scaleX(0)',
      transition: transitions.easeOut(),
    },
    error: {
      borderColor: errorStyleColor ? errorStyleColor : errorColor,
      transform: 'scaleX(1)',
    },
  };

  let underline = objectAssign({}, styles.root, style);
  let focusedUnderline = objectAssign({}, underline, styles.focus, focusStyle);

  if (disabled)
    underline = objectAssign({}, underline, styles.disabled, disabledStyle);
  if (focus)
    focusedUnderline = objectAssign({}, focusedUnderline, {
      transform: 'scaleX(1)',
    });
  if (error) focusedUnderline = objectAssign({}, focusedUnderline, styles.error);

  return (
    <div>
      <hr style={prepareStyles(underline)} />
      <hr style={prepareStyles(focusedUnderline)} />
    </div>
  );
};

TextFieldUnderline.propTypes = propTypes;
TextFieldUnderline.defaultProps = defaultProps;

export default TextFieldUnderline;
