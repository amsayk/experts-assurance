import React, { PropTypes as T } from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import Icon from 'components/icons/MaterialIcons';

import { intlShape } from 'react-intl';

import style from '../../../ProductCatalog.scss';

import Tooltip from 'components/react-components/Tooltip';

import cx from 'classnames';

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

const searchIcon = <Icon name={'search'} size={22}/>;
const closeIcon = <Icon name={'close'} size={22}/>;

export default function SearchBox({ intl, onSearch, onClose }) {
  return (
    <Dropdown componentClass={'div'} open onToggle={onClose} className={style.searchFieldWrapper} role='search'>
      <div className={cx(style.searchField, style.active, style.hasContent)}>
        <Button onClick={onSearch} bsStyle={'link'} className={style.showResultsButton} role='button'>
          <Tooltip align={tooltipAlign} overlay={'Search catalog'}>
            {searchIcon}
          </Tooltip>
        </Button>
        <div className={style.inputWrapper}>
          <input
            className={style.input}
            autoFocus
            autoComplete='off'
            autoCorrect='off'
            placeholder='Search catalog'
            type='text'
            spellCheck='false'
            style={{ outline: 'none' }}
          />
        </div>
        <Button onClick={onClose} bsStyle={'link'} className={style.clearSearch} role='button'>
          {closeIcon}
        </Button>
      </div>
      <Dropdown.Menu className={style.searchBoxMenu}>
        <MenuItem header>RECENT</MenuItem>
        <MenuItem>Product 1</MenuItem>
        <MenuItem>Product 2</MenuItem>
        <MenuItem>Product 3</MenuItem>
        <MenuItem>Product 3</MenuItem>
        <MenuItem header>TAGS</MenuItem>
        <MenuItem>Tag 1</MenuItem>
        <MenuItem>Tag 2</MenuItem>
        <MenuItem>Tag 3</MenuItem>
        <MenuItem>Tag 4</MenuItem>
        <MenuItem>Tag 5</MenuItem>
        <MenuItem>Tag 6</MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  );
}

SearchBox.propTypes = {
  onClose : T.func.isRequired,
  onSeach : T.func.isRequired,
  intl    : intlShape.isRequired,
};

