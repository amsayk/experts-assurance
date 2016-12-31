import React from 'react';
import classNames from 'classnames';
import Button from 'components/bootstrap/Button';
import SafeAnchor from 'components/bootstrap/SafeAnchor';

import { bsClass as setBsClass } from '../utils/bootstrapUtils';

import getLocalCSSClassName from '../utils/getLocalCSSClassName';
import style from './Dropdown.scss';

const propTypes = {
  open: React.PropTypes.bool,
  title: React.PropTypes.string,
  useAnchor: React.PropTypes.bool,
};

const defaultProps = {
  open: false,
  useAnchor: false,
  bsRole: 'toggle',
};

class DropdownToggle extends React.Component {
  render() {
    const {
      open,
      useAnchor,
      bsClass,
      className,
      children,
      ...props
    } = this.props;

    delete props.bsRole;

    const Component = useAnchor ? SafeAnchor : Button;

    // This intentionally forwards bsSize and bsStyle (if set) to the
    // underlying component, to allow it to render size and style variants.

    // FIXME: Should this really fall back to `title` as children?

    return (
      <Component
        {...props}
        role='button'
        className={classNames(className, getLocalCSSClassName(style, bsClass))}
        aria-haspopup
        aria-expanded={open}
      >
        {children || props.title}
      </Component>
    );
  }
}

DropdownToggle.propTypes = propTypes;
DropdownToggle.defaultProps = defaultProps;

export default setBsClass('dropdown-toggle', DropdownToggle);

