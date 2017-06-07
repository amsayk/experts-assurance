import React from 'react';
import { compose } from 'redux';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import categories from 'file-categories';

import findIndex from 'array-find-index';

import style from 'routes/Landing/styles';

import cx from 'classnames';

const ALL = {
  slug : null,
  displayName : 'Tous',
};

class CategoryToggle extends React.Component {
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
    const { category, menuOpen : open, label } = this.props;

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
          justifyContent: 'flex-start',
          minWidth: 160,
          // margin: '7px auto',
          // padding: '6px 0'
        }}>
        <div style={{ color: '#707070', fontSize: 13 }}>
          {label}:
        </div>
        <div style={{ marginLeft: 9 }}>
          {category.displayName}
        </div>
      </div>
    </Button>
    );
  }
}

class CategorySelector extends React.Component {
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

  onSelect(category) {
    this.props.onCategory(category);
  }

  render() {
    const { category, label } = this.props;
    const currentCategoryIndex = findIndex(categories, ({ slug : d }) => d === category);
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
            componentClass={CategoryToggle}
            label={label}
            category={categories[currentCategoryIndex] || ALL}
            menuOpen={this.state.open}
            onToggle={this.onToggle}
          />
          <Dropdown.Menu className={style.stateMenu}>
            {[ ALL, ...categories ].map(({ displayName : label, slug : d }, index) => (
              <MenuItem eventKey={d} key={index}>
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

CategorySelector.defaultProps = {
  label : 'Catégorie manquante',
};

export default compose(
)(CategorySelector);

