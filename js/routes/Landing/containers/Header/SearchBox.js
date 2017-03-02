import React, { PropTypes as T } from 'react';
import { withRouter } from 'react-router';

import Dropdown from 'components/bootstrap/Dropdown';
import Button from 'components/bootstrap/Button';

import { SearchIcon, CloseIcon } from 'components/icons/MaterialIcons';

import { intlShape } from 'react-intl';

import style from 'routes/Landing/styles';

import Tooltip from 'components/react-components/Tooltip';

import { PATH_SEARCH } from 'vars';

import cx from 'classnames';

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onInputStateChange.bind(this, true);
    this.onBlur = this.onInputStateChange.bind(this, false);

    this.onSearch = this.onSearch.bind(this);

    this.state = {
      hasFocus: false,
    };
  }
  onInputStateChange(hasFocus) {
    this.setState({
      hasFocus,
    }, () => this.state.hasFocus ? this.props.input.onFocus() : this.props.input.onBlur());
  }
  onSearch() {
    this.props.router.push({
      pathname : PATH_SEARCH,
      state    : { query: '' },
    });
  }
  render() {
    const { onClose } = this.props;
    return (
      <Dropdown componentClass={'div'} open onToggle={onClose} className={style.searchFieldWrapper} role='search'>
        <div className={cx(style.searchField, { [style.active]: this.state.hasFocus })}>
          <Tooltip placement='bottom' align={tooltipAlign} overlay={'Rechercher'}>
            <Button onClick={this.onSearch} bsStyle={'link'} className={style.showResultsButton} role='button'>
              <SearchIcon size={22}/>
            </Button>
          </Tooltip>
          <div className={style.inputWrapper}>
            <input
              onFocus={this.onFocus}
              onBlur={this.onBlur}
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

export default withRouter(SearchBox);

