import React, { PropTypes as T } from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import Button from 'components/bootstrap/Button';

import Icon from 'components/icons/MaterialIcons';

import { intlShape } from 'react-intl';

import style from '../../Search.scss';

import Tooltip from 'components/react-components/Tooltip';

import cx from 'classnames';

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

const searchIcon = <Icon name={'search'} size={22}/>;
const closeIcon = <Icon name={'close'} size={22}/>;

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);
  }

  onSearch() {
  }
  render() {
    const { onClose } = this.props;
    return (
      <Dropdown componentClass={'div'} open onToggle={onClose} className={style.searchFieldWrapper} role='search'>
        <div className={style.searchField}>
          <Button onClick={this.onSearch} bsStyle={'link'} className={style.showResultsButton} role='button'>
            <Tooltip align={tooltipAlign} overlay={'Search'}>
              {searchIcon}
            </Tooltip>
          </Button>
          <div className={style.inputWrapper}>
            <input
              autoFocus
              className={style.input}
              autoComplete='off'
              autoCorrect='off'
              placeholder='Search'
              type='text'
              spellCheck='false'
              style={{ outline: 'none' }}
            />
          </div>
          <Button onClick={onClose} bsStyle={'link'} className={cx(style.clearSearch, style.hidden)} role='button'>
            <Tooltip align={tooltipAlign} overlay={'Clear search'}>
              {closeIcon}
            </Tooltip>
          </Button>
        </div>
        <Dropdown.Menu className={cx(style.searchBoxMenu, style.hidden)}>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

SearchBox.propTypes = {
  onClose : T.func.isRequired,
  onSeach : T.func.isRequired,
  intl    : intlShape.isRequired,
};

export default SearchBox;

