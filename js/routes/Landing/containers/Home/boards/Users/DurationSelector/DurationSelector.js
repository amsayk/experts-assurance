import React from 'react';
import { compose } from 'redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import { durations } from 'routes/Landing/utils';

import findIndex from 'array-find-index';

import style from 'routes/Landing/styles';

import cx from 'classnames';

class DurationToggle extends React.Component {
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
  }
  onToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onToggle();
  }
  render() {
    const { duration, menuOpen : open, label } = this.props;

    let styles = {
      paddingTop: 2,
      paddingBottom: 1,
    }

    if (open) {
      styles = {
        ...styles,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: '0.25rem',
        borderTopRightRadius: '0.25rem',
      };
    } else {
      styles = {
        ...styles,
        borderRadius: '.25rem'
      };

    }

    return (
      <Button style={styles} onClick={this.onToggle} className={cx(style.togglePickState)} role='button'>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          // margin: '7px auto',
          // padding: '6px 0'
        }}>
        <div className={style['PENDING']} style={{
          color: '#707070',
          fontSize: 13,
        }}>
        {label}:
      </div>
      <div style={{ marginLeft: 9 }}>
        {duration.label}
      </div>
    </div>
  </Button>
    );
  }
}

class DurationSelector extends React.Component {
  state ={
    open : false,
  }

  onToggle() {
    this.setState(({ open }) => ({
      open : !open,
    }), () => {

    });
  }
  constructor() {
    super();

    this.onSelect = this.onSelect.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  onSelect(duration) {
    this.props.onDuration(duration);
  }

  render() {
    const { duration, label } = this.props;
    const currentDurationIndex = findIndex(durations, ({ duration : d }) => d === duration);
    return (
      <div className={style.filterGroup}>
        <div className={cx(this.state.open && style.mask)}></div>
        <Dropdown
          pullRight
          open={this.state.open}
          onToggle={this.onToggle}
          className={cx(style.pickUserDropdown, this.state.open && style.pickUserOpen)}
          onSelect={this.onSelect}
        >
          <Dropdown.Toggle
            componentClass={DurationToggle}
            label={label}
            duration={durations[currentDurationIndex]}
            menuOpen={this.state.open}
            onToggle={this.onToggle}
          />
          <Dropdown.Menu className={style.stateMenu}>
            {durations.map(({ duration : d, label }, index) => (
              <MenuItem eventKey={d} key={d}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  margin: '3px auto',
                  padding: '5px 0'
                }}>
                <div style={{ marginLeft: 9 }}>
                  {label}
                </div>
              </div>
            </MenuItem>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }

}

DurationSelector.defaultProps = {
  label : 'Durée',
};

export default compose(
)(DurationSelector);

