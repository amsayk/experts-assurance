import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import raf from 'requestAnimationFrame';

import emptyFunction from 'emptyFunction';
import focusNode from 'focusNode';
import isEmpty from 'isEmpty';

import Dropdown from 'components/bootstrap/Dropdown';
import Button from 'components/bootstrap/Button';
import MenuItem from 'components/bootstrap/MenuItem';

import Highlighter from 'react-highlight-words';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER, PATH_CASES_CASE } from 'vars';

import { SearchIcon, ArrowDropdownIcon, CloseIcon } from 'components/icons/MaterialIcons';

import memoizeStringOnly from 'memoizeStringOnly';

import { intlShape } from 'react-intl';

import style from 'routes/Search/styles';

import AdvancedSearch from 'routes/Search/components/AdvancedSearch';

import Tooltip from 'components/react-components/Tooltip';

import ActivityIndicator from 'components/ActivityIndicator';

import {
  UnknownIcon,
  WatchIcon,
  DoneIcon,
  CanceledIcon,
} from 'components/icons/MaterialIcons';

import {
  toggleAdvancedMode,
  onClear,
  merge,
} from 'redux/reducers/docSearch/actions';

import cx from 'classnames';

import selector from './selector';

import { injectIntl } from 'react-intl';

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

const STATE_MAP = {
  PENDING  : 'Dossiers en cours',
  OPEN     : 'Dossiers validés',
  CLOSED   : 'Dossiers clos',
  CANCELED : 'Dossiers annulés',
};

const isValidQ = memoizeStringOnly(function isValidQ(q) {
  return q && q.length >= 2;
});

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.onSearch              = this.onSearch.bind(this);

    this.onLastModified           = this.onLastModified.bind(this);
    this.onTextInput           = this.onTextInput.bind(this);
    this.onState               = this.onState.bind(this);
    this.onAgent               = this.onAgent.bind(this);
    this.onClient              = this.onClient.bind(this);
    this.onUser                = this.onUser.bind(this);
    this.onCloser              = this.onCloser.bind(this);
    this.onValidator           = this.onValidator.bind(this);
    this.onRange               = this.onRange.bind(this);
    this.onValidationRange     = this.onValidationRange.bind(this);
    this.onClosureRange        = this.onClosureRange.bind(this);

    this.onClearSearch         = this.onClearSearch.bind(this);
    this._onKeyDown            = this._onKeyDown.bind(this);

    this.onToggleAdvancedMode  = this.onToggleAdvancedMode.bind(this);

    this.state = {
      search : props.search,
    };
  }

  onLastModified(date) {
    this.setState(({ search }) => ({
      search : search.merge({
        lastModified: date,
      }),
    }));
  }

  onState(state) {
    this.setState(({ search }) => ({
      search : search.merge({
        state,
      }),
    }));
  }

  onAgent(id) {
    this.setState(({ search }) => ({
      search : search.merge({
        agent : id ? {id} : null,
      }),
    }));
  }

  onClient(id) {
    this.setState(({ search }) => ({
      search : search.merge({
        client : id ? {id} : null,
      }),
    }));
  }


  onUser(id) {
    this.setState(({ search }) => ({
      search : search.merge({
        user : id ? {id} : null,
      }),
    }));
  }


  onValidator(id) {
    this.setState(({ search }) => ({
      search : search.merge({
        validator : id ? {id} : null,
      }),
    }));
  }

  onCloser(id) {
    this.setState(({ search }) => ({
      search : search.merge({
        closer: id ? {id} : null,
      }),
    }));
  }

  onRange(range) {
    this.setState(({ search }) => ({
      search : search.merge({
        range,
      }),
    }));
  }


  onValidationRange(range) {
    this.setState(({ search }) => ({
      search : search.merge({
        validationRange: range,
      }),
    }));
  }

  onClosureRange(range) {
    this.setState(({ search }) => ({
      search : search.merge({
        closureRange: range,
      }),
    }));
  }

  onTextInput(e) {
    const q = e.target.value;
    this.setState(({ search }) => ({
      search : search.merge({
        q,
      }),
    }));
  }
  onClearSearch(e) {
    e.stopPropagation();
    e.preventDefault();

    this.props.actions.onClear();
    setTimeout(() => {
      this.setState({
        search : this.props.search,
      });
    }, 0);
  }
  onToggleAdvancedMode(e) {
    e.stopPropagation();
    e.preventDefault();

    const { advancedMode } = this.props.search;

    setTimeout(() => {
      this.props.actions.toggleAdvancedMode();

      raf(() => {
        if (advancedMode) {
          // focusNode(this.input);
        }
        // if (this.props.search.active === false) {
        //   this.props.actions.onToggle();
        // }
      });
    }, 20);
  }
  onSearch() {
    this.props.actions.merge(this.state.search);
  }
  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      this.onSearch();
    }

    if (e.key === 'Backspace') {
      if (isEmpty(this.state.search.q)) {
        this.onState(null);
      }
    }
  }

  renderAdvancedSearch() {
    return (
      <MenuItem
        componentClass={AdvancedSearch}
        search={this.state.search}
        qClassName={style.full}
        actions={{
          onState           : this.onState,
          onAgent           : this.onAgent,
          onClient          : this.onClient,
          onUser            : this.onUser,
          onCloser          : this.onCloser,
          onValidator       : this.onValidator,
          onLastModified    : this.onLastModified,
          onRange           : this.onRange,
          onValidationRange : this.onValidationRange,
          onClosureRange    : this.onClosureRange,
          onClear           : this.onClearSearch,
          onSearch          : this.onSearch,
        }}
      />
    );
  }
  render() {
    const { search: { advancedMode }, loading = false, actions } = this.props;
    const { search : { state, q } } = this.state;

    let menu = null;

    // advanced menu
    if (advancedMode) {
      menu = this.renderAdvancedSearch();
    }

    return (
      <Dropdown componentClass={'div'} open onToggle={emptyFunction} onClose={this.onClose} className={style.searchFieldWrapper} role='search'>
        <div data-root-close-ignore className={cx(style.searchField, isValidQ(q) && style.hasInput, style.active)}  role='dropdown-toggle'>
          <Tooltip placement='bottom' align={tooltipAlign} overlay={'Recherche des dossiers'}>
            {loading ? <ActivityIndicator className={style.searchLoading}/> : <Button onClick={this.onSearch} bsStyle={'link'} className={style.showResultsButton} role='button'>
              <SearchIcon size={22}/>
            </Button>}
          </Tooltip>
          {state && <div className={style[`docSearchState_${state}`]}>
            {STATE_MAP[state]}
          </div>}
          <div className={style.inputWrapper}>
            <input
              autoFocus
              ref={(input) => this.input = input}
              className={style.input}
              autoComplete='off'
              autoCorrect='off'
              value={q}
              onChange={this.onTextInput}
              placeholder='Recherche des dossiers'
              type='text'
              spellCheck='false'
              style={{ outline: 'none' }}
              onKeyDown={this._onKeyDown}
            />
          </div>
          <Tooltip placement='bottom' align={tooltipAlign} overlay={'Recherche avancée'}>
            <Button onClick={this.onToggleAdvancedMode} bsStyle={'link'} className={style.toggleAdvancedMode} role='button'>
              <ArrowDropdownIcon size={22}/>
            </Button>
          </Tooltip>
          {isValidQ(q) ? <Button onClick={this.onClearSearch} bsStyle={'link'} className={style.clearSearch} role='button'>
            <CloseIcon size={20}/>
          </Button> : null}
        </div>
        <Dropdown.Menu className={style.searchBoxMenu}>
          {menu}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

SearchBox.propTypes = {
  intl     : intlShape.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      toggleAdvancedMode,
      onClear,
      merge,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(SearchBox);

