import React from 'react';
import T from 'prop-types';
import objectAssign from 'object-assign';
import transitions from '../styles/transitions';

function getStyles(props) {
  const { muiTheme: { textField: { hintColor } }, show } = props;

  return {
    root: {
      position: 'absolute',
      opacity: show ? 1 : 0,
      color: hintColor,
      transition: transitions.easeOut(),
      bottom: 12,
    },
  };
}

const TextFieldHint = props => {
  const { muiTheme: { prepareStyles }, style, text } = props;

  const styles = getStyles(props);

  return (
    <div style={prepareStyles(objectAssign(styles.root, style))}>
      {text}
    </div>
  );
};

TextFieldHint.propTypes = {
  /**
   * @ignore
   * The material-ui theme applied to this component.
   */
  muiTheme: T.object.isRequired,
  /**
   * True if the hint text should be visible.
   */
  show: T.bool,
  /**
   * Override the inline-styles of the root element.
   */
  style: T.object,
  /**
   * The hint text displayed.
   */
  text: T.node,
};

TextFieldHint.defaultProps = {
  show: true,
};

export default TextFieldHint;
