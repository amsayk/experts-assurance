import classNames from 'classnames';
import keycode from 'keycode';
import React from 'react';
import ReactDOM from 'react-dom';
import RootCloseWrapper from 'components/bootstrap/RootCloseWrapper';

import { bsClass, getClassSet, prefix, splitBsProps } from '../utils/bootstrapUtils';
import createChainedFunction from '../utils/createChainedFunction';
import ValidComponentChildren from '../utils/ValidComponentChildren';

import getLocalCSSClassName from '../utils/getLocalCSSClassName';
import style from './Dropdown.scss';

const propTypes = {
  open: React.PropTypes.bool,
  pullRight: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  labelledBy: React.PropTypes.oneOfType([
    React.PropTypes.string, React.PropTypes.number,
  ]),
  onSelect: React.PropTypes.func,
  rootCloseEvent: React.PropTypes.oneOf(['click', 'mousedown']),
  onNext: React.PropTypes.func,
  onPrevious: React.PropTypes.func,
};

const defaultProps = {
  bsRole: 'menu',
  pullRight: false,
};

class DropdownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
      case keycode.codes.down:
        this.focusNext(event);
        this.props.onNext || event.preventDefault();
        break;
      case keycode.codes.up:
        this.focusPrevious(event);
        this.props.onPrevious || event.preventDefault();
        break;
      case keycode.codes.esc:
      case keycode.codes.tab:
        this.props.onClose(event);
        break;
      default:
    }
  }

  getItemsAndActiveIndex() {
    const items = this.getFocusableMenuItems();
    const activeIndex = items.indexOf(document.activeElement);

    return { items, activeIndex };
  }

  getFocusableMenuItems() {
    const node = ReactDOM.findDOMNode(this);
    if (!node) {
      return [];
    }

    return Array.from(node.querySelectorAll('[tabIndex="-1"]'));
  }

  focusNext(event) {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }

    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    items[nextIndex].focus();

    this.props.onNext && this.props.onNext(activeIndex, event);
  }

  focusPrevious(event) {
    const { items, activeIndex } = this.getItemsAndActiveIndex();
    if (items.length === 0) {
      return;
    }

    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    items[prevIndex].focus();

    this.props.onPrevious && this.props.onPrevious(activeIndex, event);
  }

  render() {
    const {
      open,
      pullRight,
      onClose,
      labelledBy,
      onSelect,
      className,
      rootCloseEvent,
      children,
      ...props
    } = this.props;

    const [bsProps, elementProps] = splitBsProps(props);

    const classes = {
      ...getClassSet(style, bsProps),
      [getLocalCSSClassName(style, prefix(bsProps, 'right'))]: pullRight,
    };

    return (
      <RootCloseWrapper
        disabled={!open}
        onRootClose={onClose}
        event={rootCloseEvent}
      >
        <div
          {...elementProps}
          role='menu'
          className={classNames(className, classes)}
          aria-labelledby={labelledBy}
        >
          {ValidComponentChildren.map(children, child => (
            React.cloneElement(child, {
              onKeyDown: createChainedFunction(
                child.props.onKeyDown, this.handleKeyDown
              ),
              onSelect: createChainedFunction(child.props.onSelect, onSelect),
            })
          ))}
        </div>
      </RootCloseWrapper>
    );
  }
}

DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;

export default bsClass('dropdown-menu', DropdownMenu);

