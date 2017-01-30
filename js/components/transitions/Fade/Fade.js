import React, { PropTypes as T } from 'react';
import cx from 'classnames';
import Transition from 'react-overlays/lib/Transition';

import style from './Fade.scss';

class Fade extends React.Component {
  render() {
    const { className, ...props } = this.props;
    return (
      <Transition
        {...props}
        className={cx(className)}
        enteringClassName={style.enter}
        enteredClassName={cx(style.enter, style.active)}
        exitingClassName={style.leave}
        exitedClassName={cx(style.leave, style.active)}
      />
    );
  }
}

Fade.propTypes = {
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
Fade.defaultProps =  {
  in: false,
  timeout: 300,
  unmountOnExit: false,
  transitionAppear: false,
};

export default Fade;

