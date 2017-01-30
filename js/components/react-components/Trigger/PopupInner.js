import React, { PropTypes as T } from 'react';
import LazyRenderBox from './LazyRenderBox';

export default class PopupInner extends React.Component {
  static propTypes = {
    hiddenClassName : T.string,
    className       : T.string,
    prefixCls       : T.string,
    onMouseEnter    : T.func,
    onMouseLeave    : T.func,
    children        : T.any,
  };

  render() {
    const props = this.props;
    let className = props.className;
    if (!props.visible) {
      className += ` ${props.hiddenClassName}`;
    }
    return (
      <div
        className={className}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        style={props.style}>
        <LazyRenderBox className={`${props.prefixCls}-content`} visible={props.visible}>
          {props.children}
        </LazyRenderBox>
      </div>
    );
  }
}

