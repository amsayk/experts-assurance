import React, { PropTypes as T } from 'react';
import classNames from 'classnames';
import ReactBootstrapTransition from 'react-overlays/lib/Transition';

const propTypes = {
  /**
   * Show the component; triggers the fade in or fade out animation
   */
  in: T.bool,

  /**
   * Unmount the component (remove it from the DOM) when it is faded out
   */
  unmountOnExit: T.bool,

  /**
   * Run the fade in animation when the component mounts, if it is initially
   * shown
   */
  transitionAppear: T.bool,

  /**
   * Duration of the fade animation in milliseconds, to ensure that finishing
   * callbacks are fired even if the original browser transition end events are
   * canceled
   */
  timeout: T.number,

  /**
   * Callback fired before the component fades in
   */
  onEnter: T.func,
  /**
   * Callback fired after the component starts to fade in
   */
  onEntering: T.func,
  /**
   * Callback fired after the has component faded in
   */
  onEntered: T.func,
  /**
   * Callback fired before the component fades out
   */
  onExit: T.func,
  /**
   * Callback fired after the component starts to fade out
   */
  onExiting: T.func,
  /**
   * Callback fired after the component has faded out
   */
  onExited: T.func,

  transitionName: T.string.isRequired,
};

const defaultProps = {
  in: false,
  timeout: 300,
  unmountOnExit: false,
  transitionAppear: false,
};

class Transition extends React.Component {
  render() {
    const { className, transitionName, ...props } = this.props;
    return (
      <ReactBootstrapTransition
        {...props}
        className={classNames(className, transitionName)}
        enteringClassName={`${transitionName}-enter`}
        enteredClassName={`${transitionName}-enter ${transitionName}-enter-active`}
        exitingClassName={`${transitionName}-leave`}
        exitedClassName={`${transitionName}-leave ${transitionName}-leave-active`}
      />
    );
  }
}

Transition.propTypes = propTypes;
Transition.defaultProps = defaultProps;

export default Transition;

