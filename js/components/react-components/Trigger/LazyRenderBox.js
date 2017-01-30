import React, { PropTypes as T } from 'react';

export default class LazyRenderBox extends React.Component {
  static propTypes = {
    children        : T.any,
    className       : T.string,
    visible         : T.bool,
    hiddenClassName : T.string,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.hiddenClassName || nextProps.visible;
  }

  render() {
    const { hiddenClassName, visible, ...props } = this.props;

    if (hiddenClassName || React.Children.count(props.children) > 1) {
      if (!visible && hiddenClassName) {
        props.className += ` ${hiddenClassName}`;
      }
      return <div {...props}/>;
    }

    return React.Children.only(props.children);
  }
}

