import React from 'react';
import T from 'prop-types';
import objectAssign from 'object-assign';
import transitions from '../styles/transitions';

function getStyles(props) {
  const defaultStyles = {
    position: 'absolute',
    lineHeight: '22px',
    top: 38,
    transition: transitions.easeOut(),
    zIndex: 1, // Needed to display label above Chrome's autocomplete field background
    transform: 'scale(1) translate(0, 0)',
    transformOrigin: 'left top',
    pointerEvents: 'auto',
    userSelect: 'none',
  };

  const shrinkStyles = props.shrink
    ? objectAssign(
        {
          transform: 'scale(0.75) translate(0, -28px)',
          pointerEvents: 'none',
        },
        props.shrinkStyle,
      )
    : null;

  return {
    root: objectAssign(defaultStyles, props.style, shrinkStyles),
  };
}

const TextFieldLabel = props => {
  const { muiTheme, className, children, htmlFor, onTouchTap } = props;

  const { prepareStyles } = muiTheme;
  const styles = getStyles(props);

  return (
    <label
      className={className}
      style={prepareStyles(styles.root)}
      htmlFor={htmlFor}
      onTouchTap={onTouchTap}
    >
      {children}
    </label>
  );
};

TextFieldLabel.propTypes = {
  /**
   * The label contents.
   */
  children: T.node,
  /**
   * The css class name of the root element.
   */
  className: T.string,
  /**
   * Disables the label if set to true.
   */
  disabled: T.bool,
  /**
   * The id of the target element that this label should refer to.
   */
  htmlFor: T.string,
  /**
   * @ignore
   * The material-ui theme applied to this component.
   */
  muiTheme: T.object.isRequired,
  /**
   * Callback function for when the label is selected via a touch tap.
   *
   * @param {object} event TouchTap event targeting the text field label.
   */
  onTouchTap: T.func,
  /**
   * True if the floating label should shrink.
   */
  shrink: T.bool,
  /**
   * Override the inline-styles of the root element when shrunk.
   */
  shrinkStyle: T.object,
  /**
   * Override the inline-styles of the root element.
   */
  style: T.object,
};

TextFieldLabel.defaultProps = {
  disabled: false,
  shrink: false,
};

export default TextFieldLabel;
