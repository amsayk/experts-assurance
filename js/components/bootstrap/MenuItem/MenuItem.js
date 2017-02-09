import classNames from 'classnames';
import React from 'react';
import all from 'react-prop-types/lib/all';
import elementType from 'react-prop-types/lib/elementType';

import SafeAnchor from 'components/bootstrap/SafeAnchor';
import { bsClass, prefix, splitBsPropsAndOmit } from '../utils/bootstrapUtils';
import createChainedFunction from '../utils/createChainedFunction';

import getLocalCSSClassName from '../utils/getLocalCSSClassName';
import style from './MenuItem.scss';

const propTypes = {
  componentClass: elementType,

  /**
   * Disable the menu item, making it unselectable.
   */
  disabled: React.PropTypes.bool,

  /**
   * style the menu item as a horizontal rule, providing visual separation between
   * groups of menu items.
   */
  divider: all(
    React.PropTypes.bool,
    ({ divider, children }) => (
      divider && children ?
      new Error('Children will not be rendered for dividers') :
      null
    ),
  ),

  /**
   * Value passed to the `onSelect` handler, useful for identifying the selected menu item.
   */
  eventKey: React.PropTypes.any,

  /**
   * style the menu item as a header label, useful for describing a group of menu items.
   */
  header: React.PropTypes.bool,

  /**
   * HTML `href` attribute corresponding to `a.href`.
   */
  href: React.PropTypes.string,

  /**
   * React-router `to` attribute.
   */
  to: React.PropTypes.string,

  /**
   * Callback fired when the menu item is clicked.
   */
  onClick: React.PropTypes.func,

  /**
   * Callback fired when the menu item is selected.
   *
   * ```js
   * (eventKey: any, event: Object) => any
   * ```
   */
  onSelect: React.PropTypes.func,
};

const defaultProps = {
  componentClass: SafeAnchor,
  divider: false,
  disabled: false,
  header: false,
};

class MenuItem extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const { href, to, disabled, onSelect, eventKey } = this.props;

    if ((!href && !to) || disabled) {
      event.preventDefault();
    }

    if (disabled) {
      return;
    }

    if (onSelect) {
      onSelect(eventKey, event);
    }
  }

  render() {
    const {
      componentClass: Component,
      disabled,
      divider,
      header,
      onClick,
      className,
      ...props
    } = this.props;

    const [bsProps, elementProps] = splitBsPropsAndOmit(props, [
      'eventKey', 'onSelect',
    ]);

    if (divider) {
      // Forcibly blank out the children; separators shouldn't render any.
      elementProps.children = undefined;

      return (
        <div
          {...elementProps}
          role='separator'
          className={classNames(className, getLocalCSSClassName(style, 'divider'))}
        ></div>
      );
    }

    if (header) {
      const Header = Component === defaultProps.componentClass ? 'h6' : Component;
      return (
        <Header
          {...elementProps}
          role='heading'
          className={classNames(className, getLocalCSSClassName(style, prefix(bsProps, 'header')))}
        ></Header>
      );
    }

    const classes = {
      [getLocalCSSClassName(style, 'disabled')]: disabled,
      [getLocalCSSClassName(style, prefix(bsProps, 'item'))]: true,
    };

    return (
      <Component
        {...elementProps}
        role='menuitem'
        tabIndex='-1'
        className={classNames(className, classes)}
        onClick={createChainedFunction(onClick, this.handleClick)}
      />
    );
  }
}

MenuItem.propTypes = propTypes;
MenuItem.defaultProps = defaultProps;

export default bsClass('dropdown', MenuItem);

