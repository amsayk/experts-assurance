import React from 'react';
import T from 'prop-types';

import Transition from 'components/Transition';

import style from './Zoom.scss';

import cx from 'classnames';

class Zoom extends React.PureComponent {
  render() {
    const { className, ...props } = this.props;
    return (
      <Transition
        {...props}
        className={cx(className)}
        enteringClassName={style.enter}
        enteredClassName={cx(style.enter, style['enter-active'])}
        exitingClassName={style.leave}
        exitedClassName={cx(style.leave, style['leave-active'])}
      />
    );
  }
}

Zoom.propTypes = {
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
};
Zoom.defaultProps = {
  in: false,
  timeout: 300,
  unmountOnExit: false,
  transitionAppear: false,
};

export default Zoom;
