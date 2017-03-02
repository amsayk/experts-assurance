import React, { PropTypes as T } from 'react';

import Dropdown from 'components/bootstrap/Dropdown';
import Button from 'components/bootstrap/Button';

import { CloseIcon, SearchIcon } from 'components/icons/MaterialIcons';

import { intlShape } from 'react-intl';

import style from '../../Search.scss';

import Tooltip from 'components/react-components/Tooltip';

import cx from 'classnames';

const tooltipAlign = {
  offset: [0, -4],
};

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
          <Tooltip placement='bottom' align={tooltipAlign} overlay={'Rechercher'}>
            <Button onClick={this.onSearch} bsStyle={'link'} className={style.showResultsButton} role='button'>
              <SearchIcon size={22}/>
            </Button>
          </Tooltip>
          <div className={style.inputWrapper}>
            <input
              autoFocus
              className={style.input}
              autoComplete='off'
              autoCorrect='off'
              placeholder='Rechercher'
              type='text'
              spellCheck='false'
              style={{ outline: 'none' }}
            />
          </div>
          <Tooltip placement='bottom' align={tooltipAlign} overlay={'Effacer la recherche'}>
            <Button onClick={onClose} bsStyle={'link'} className={cx(style.clearSearch, style.hidden)} role='button'>
              <CloseIcon size={22}/>
            </Button>
          </Tooltip>
        </div>
        <Dropdown.Menu className={cx(style.searchBoxMenu, style.hidden)}>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

SearchBox.propTypes = {
  onClose  : T.func.isRequired,
  onSearch : T.func.isRequired,
  intl     : intlShape.isRequired,
};

export default SearchBox;

