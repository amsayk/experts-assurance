import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router';

import raf from 'requestAnimationFrame';

import emptyFunction from 'emptyFunction';
import focusNode from 'focusNode';
import isEmpty from 'isEmpty';

import DataLoader from 'routes/Landing/DataLoader';

import Dropdown from 'components/bootstrap/Dropdown';
import Button from 'components/bootstrap/Button';
import MenuItem from 'components/bootstrap/MenuItem';

import Highlighter from 'react-highlight-words';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER, PATH_CASES_CASE } from 'vars';

import { SearchIcon, ArrowDropdownIcon, CloseIcon } from 'components/icons/MaterialIcons';

import memoizeStringOnly from 'memoizeStringOnly';

import { intlShape } from 'react-intl';

import style from 'routes/Landing/styles';

import AdvancedSearch from 'routes/Search/components/AdvancedSearch';

import Tooltip from 'components/react-components/Tooltip';

import ActivityIndicator from 'components/ActivityIndicator';

import {
  // UnknownIcon,
  WatchIcon,
  DoneIcon,
  CanceledIcon,
} from 'components/icons/MaterialIcons';

import {
  toggleSearch,
  onTextInput,
  toggleAdvancedMode,
  onState,
  onClear,
  merge,
} from 'redux/reducers/docSearch/actions';

import { PATH_SEARCH } from 'vars';

import cx from 'classnames';

import selector from './selector';

import { injectIntl } from 'react-intl';

const STATE_MAP = {
  // PENDING  : 'Dossiers en attente',
  OPEN     : 'Dossiers en cours',
  CLOSED   : 'Dossiers clos',
  CANCELED : 'Dossiers annulés',
};

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

const isValidQ = memoizeStringOnly(function isValidQ(q) {
  return q && q.length >= 2;
});

function *intersperse(a, delim) {
  let first = true;
  for (const x of a) {
    if (!first) yield delim;
    first = false;
    yield x;
  }
}

const Doc = ({ q, intl, qClassName, className, tabIndex, role, hit: { highlight, _source: { id, refNo, state, date, lastModified, manager, client, agent, user, validation, closure, vehicle } } }) => {

  const matches = highlight.reduce(function (matches, highlight) {
    switch (highlight) {
      case 'manager.name':
        // case 'manager.email':
        matches.push(
          <div className={style.highlightGroup}>
            <span className={style.highlightGroupLabel}>
              Gestionnaire:{' '}
            </span>
            <span className={style.highlightGroupLinkWrapper}>
              <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + manager.id}>
                <span>
                  <Highlighter
                    highlightClassName={style.hit}
                    searchWords={[q]}
                    textToHighlight={manager.name}
                  />
                </span>
              </Link>
            </span>
          </div>
        );
        break;

      case 'client.name':
        // case 'client.email':
        matches.push(
          <div className={style.highlightGroup}>
            <span className={style.highlightGroupLabel}>
              Assuré:{' '}
            </span>
            <span className={style.highlightGroupLinkWrapper}>
              <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + client.id}>
                <span>
                  <Highlighter
                    highlightClassName={style.hit}
                    searchWords={[q]}
                    textToHighlight={client.name}
                  />
                </span>
              </Link>
            </span>
          </div>
        );
        break;

      case 'agent.name':
        // case 'agent.email':
        matches.push(
          <div className={style.highlightGroup}>
            <span className={style.highlightGroupLabel}>
              Agent:{' '}
            </span>
            <span className={style.highlightGroupLinkWrapper}>
              <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + agent.id}>
                <span>
                  <Highlighter
                    highlightClassName={style.hit}
                    searchWords={[q]}
                    textToHighlight={agent.name}
                  />
                </span>
              </Link>
            </span>
          </div>
        );
        break;

      case 'user.name':
        // case 'user.email':
        matches.push(
          <div className={style.highlightGroup}>
            <span className={style.highlightGroupLabel}>
              Crée par:{' '}
            </span>
            <span className={style.highlightGroupLinkWrapper}>
              <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
                <span>
                  <Highlighter
                    highlightClassName={style.hit}
                    searchWords={[q]}
                    textToHighlight={user.name}
                  />
                </span>
              </Link>
            </span>
          </div>
        );
        break;

      case 'validation_user.name':
        // case 'validation_user.email':
        matches.push(
          <div className={style.highlightGroup}>
            <span className={style.highlightGroupLabel}>
              Validé par:{' '}
            </span>
            <span className={style.highlightGroupLinkWrapper}>
              <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + validation.user.id}>
                <span>
                  <Highlighter
                    highlightClassName={style.hit}
                    searchWords={[q]}
                    textToHighlight={validation.user.name}
                  />
                </span>
              </Link>
            </span>
          </div>
        );
        break;

      case 'payment_user.name':
        matches.push(
          <div className={style.highlightGroup}>
            <span className={style.highlightGroupLabel}>
              Paiement par:{' '}
            </span>
            <span className={style.highlightGroupLinkWrapper}>
              <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + validation.user.id}>
                <span>
                  <Highlighter
                    highlightClassName={style.hit}
                    searchWords={[q]}
                    textToHighlight={validation.user.name}
                  />
                </span>
              </Link>
            </span>
          </div>
        );
        break;

      case 'closure_user.name':
        // case 'closure_user.email':
        matches.push(
          <div className={style.highlightGroup}>
            <span className={style.highlightGroupLabel}>
              Clôturé par:{' '}
            </span>
            <span className={style.highlightGroupLinkWrapper}>
              <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + closure.user.id}>
                <span>
                  <Highlighter
                    highlightClassName={style.hit}
                    searchWords={[q]}
                    textToHighlight={closure.user.name}
                  />
                </span>
              </Link>
            </span>
          </div>
        );
        break;

      case 'vehicle.model':
      case 'vehicle.plateNumber':
        matches.push(
          <div className={style.highlightGroup}>
            <span className={style.highlightGroupLabel}>
              Véhicule:{' '}
            </span>
            <span className={style.highlightGroupLinkWrapper}>
              <span>
                <Highlighter
                  highlightClassName={style.hit}
                  searchWords={[q]}
                  textToHighlight={`${vehicle.model}, ${vehicle.plateNumber}`}
                />
              </span>
            </span>
          </div>
        );
        break;

    }

    return matches;
  }, []);

  return (
    <div role={role} tabIndex={tabIndex} className={cx(qClassName, style.docSearchDoc, className)}>
      {STATES_2[state]}
      <div style={{ marginLeft: 12 }} className={style.docSearchDocInfo}>
        <div className={style.docSearchDocTop}>
          <Link to={PATH_CASES_CASE + '/' + id}>
            Dossier <b>{refNo}</b>
          </Link>
        </div>
        <div className={style.docSearchDocMiddle}>
          {[...intersperse(matches, <div style={{ margin: 'auto 6px' }} className={style.highlightGroupLabel}> · </div>)]}
        </div>
        {/* <div className={style.docSearchDocBottom}> */}
          {/*   {intl.formatRelative(lastModified || date)} */}
          {/* </div> */}
      </div>
    </div>
  );
}

function getState2(state, icon) {
  return (
    <div className={style.state} style={{ marginRight: 5 }}>
      <span className={style[state]} style={{ opacity: 0.65 }}>
        {icon}
      </span>
    </div>
  );
}

function getState(state, stateText, icon) {
  return (
    <div className={style.state} style={{ marginRight: 5 }}>
      <span className={style[state]}>
        {icon}
      </span>
      <span className={style.text} style={{ marginLeft: 12 }}>
        {stateText}
      </span>
    </div>
  );
}

const STATES_2 = {
  // PENDING  : getState2('PENDING',  <UnknownIcon   size={32}/>),
  OPEN     : getState2('OPEN',     <WatchIcon     size={32}/>),
  CLOSED   : getState2('CLOSED',   <DoneIcon      size={32}/>),
  CANCELED : getState2('CANCELED', <CanceledIcon  size={32}/>),
};

const STATES = {
  // PENDING  : getState('PENDING',  'Dossiers en attente',  <UnknownIcon   size={24}/>),
  OPEN     : getState('OPEN',     'Dossiers en cours',    <WatchIcon     size={24}/>),
  CLOSED   : getState('CLOSED',   'Dossiers clos',        <DoneIcon      size={24}/>),
  CANCELED : getState('CANCELED', 'Dossiers annulés',     <CanceledIcon  size={24}/>),
};

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.onSearch                  = this.onSearch.bind(this);
    this.onLastModified            = this.onLastModified.bind(this);
    this.onSearchAdvancedSearch    = this.onSearchAdvancedSearch.bind(this);
    this.onTextInput               = this.onTextInput.bind(this);
    this.onClearSearch             = this.onClearSearch.bind(this);
    this._onKeyDown                = this._onKeyDown.bind(this);
    this.onToggleAdvancedMode      = this.onToggleAdvancedMode.bind(this);

    this.onTextInputAdvancedSearch = this.onTextInputAdvancedSearch.bind(this);
    this.onState                   = this.onState.bind(this);
    this.onManager                 = this.onManager.bind(this);
    this.onClient                  = this.onClient.bind(this);
    this.onUser                    = this.onUser.bind(this);
    this.onCloser                  = this.onCloser.bind(this);
    this.onValidator               = this.onValidator.bind(this);
    this.onRange                   = this.onRange.bind(this);
    // this.onValidationRange         = this.onValidationRange.bind(this);
    this.onClosureRange            = this.onClosureRange.bind(this);


    this.onFocus = this.props.actions.onToggle.bind(null, true);
    this.onBlur = this.onBlur.bind(this);

    this.onClose = this.onClose.bind(this);

    this.onStateFilter = this.onStateFilter.bind(this);

    this.state = {
      search : props.search,
    };
  }
  onBlur(e) {
    e.stopPropagation();
    e.preventDefault();

    setTimeout(() => {
      raf(() => this.props.actions.onToggle(false));
    }, 50);
  }
  onClose() {
    this.props.actions.onToggle(false);
  }
  onTextInput(e) {
    if (this.props.search.advancedMode) {
      return this.onTextInputAdvancedSearch(e);
    }
    this.props.actions.onTextInput(e.target.value);
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

  onManager(id) {
    this.setState(({ search }) => ({
      search : search.merge({
        manager : id ? {id} : null,
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


  // onValidationRange(range) {
  //   this.setState(({ search }) => ({
  //     search : search.merge({
  //       validationRange: range,
  //     }),
  //   }));
  // }

  onClosureRange(range) {
    this.setState(({ search }) => ({
      search : search.merge({
        closureRange: range,
      }),
    }));
  }

  onTextInputAdvancedSearch(e) {
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
        search: this.props.search,
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
          focusNode(this.input);
        }
        if (this.props.search.active === false) {
          setTimeout(() => {
            this.props.actions.onToggle(true);
          }, 20);
        }
      });
    }, 20);
  }
  onSearch() {
    this.props.router.push({
      pathname : PATH_SEARCH,
    });
  }
  onSearchAdvancedSearch() {
    this.props.router.push({
      pathname : PATH_SEARCH,
    });
    this.props.actions.merge(this.state.search);
  }
  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      this.onSearch();
    }

    if (e.key === 'Backspace') {
      if (isEmpty(this.props.search.q)) {
        this.props.actions.onState(null);
      }
    }
  }
  onStateFilter(key) {
    const { onState, onToggle, toggleAdvancedMode : onToggleAdvancedMode } = this.props.actions;
    switch (key) {
      case 'advancedMode':
        return setTimeout(() => {
          raf(() => onToggleAdvancedMode());
        }, 100);
      default:
        onState(key);
        return setTimeout(() => {
          raf(() => {
            focusNode(this.input);
            setTimeout(() => {
              onToggle(true);
            }, 75);
          });
        }, 0);
    }
  }
  renderStateFilters() {
    return [
      // <MenuItem onSelect={this.onStateFilter} key='PENDING' eventKey='PENDING' className={style.stateFilter_PENDING}>
      //   {STATES.PENDING}
      // </MenuItem>,
      <MenuItem onSelect={this.onStateFilter} key='OPEN' eventKey='OPEN' className={style.stateFilter_OPEN}>
        {STATES.OPEN}
      </MenuItem>,
      <MenuItem onSelect={this.onStateFilter} key='CLOSED' eventKey='CLOSED' className={style.stateFilter_CLOSED}>
        {STATES.CLOSED}
      </MenuItem>,
      <MenuItem onSelect={this.onStateFilter} key='CANCELED' eventKey='CANCELED' className={style.stateFilter_CANCELED}>
        {STATES.CANCELED}
      </MenuItem>,
      <MenuItem divider></MenuItem>,
      <MenuItem onSelect={this.onStateFilter} key='advancedMode' eventKey='advancedMode' className={style.stateFilterAdvancedSearch}>
        Recherche avancée
      </MenuItem>,
    ];

  }

  renderDocs(hits) {
    return hits.map((hit, index) => (
      <MenuItem
        qClassName={index === 0 && style.noTopBorder}
        q={this.props.search.q}
        intl={this.props.intl}
        key={hit._id}
        eventKey={hit._id}
        componentClass={Doc}
        hit={hit}
      />
    ));
  }
  renderAdvancedSearch() {
    return (
      <MenuItem
        componentClass={AdvancedSearch}
        search={this.state.search}
        actions={{
          onState                 : this.onState,
          onManager               : this.onManager,
          onClient                : this.onClient,
          onUser                  : this.onUser,
          onCloser                : this.onCloser,
          onValidator             : this.onValidator,
          onLastModified          : this.onLastModified,
          onRange                 : this.onRange,
          // onValidationRange       : this.onValidationRange,
          onClosureRange          : this.onClosureRange,
          onClear                 : this.onClearSearch,
          onSearch                : this.onSearchAdvancedSearch,
          onLastModified          : this.onLastModified,
        }}
      />
    );
  }
  render() {
    const { search : { state, active, showStateFilter, q, advancedMode }, loading = false, cursor = 0, length = 0, hits = [], actions } = this.props;
    const { search : { state: sState, q: sQ } } = this.state;

    let menu = null;

    // advanced menu
    if (active) {
      if (advancedMode) {
        menu = this.renderAdvancedSearch();
      } else if (!q) {
        // state filter menu
        menu =  showStateFilter && !state
          ? this.renderStateFilters()
          : null;
      } else {
        // search results
        if (!loading) {
          menu = hits.length
            ? this.renderDocs(hits)
            : isValidQ(q) && (
              <div style={{ display: 'flex', opacity: 0.54, alignItems: 'center', justifyContent: 'center' }}>
                Aucun résultat
              </div>
            );
        }
      }
    }

    return (
      <Dropdown componentClass={'div'} open onToggle={emptyFunction} onClose={this.onClose} className={style.searchFieldWrapper} role='search'>
        <div data-root-close-ignore className={cx(style.searchField, isValidQ(q) && style.hasInput, active && style.active)}  role='dropdown-toggle'>
          <Tooltip placement='bottom' align={tooltipAlign} overlay={'Recherche des dossiers'}>
            {loading ? <ActivityIndicator className={style.searchLoading}/> : <Button onClick={this.onSearch} bsStyle={'link'} className={style.showResultsButton} role='button'>
              <SearchIcon size={22}/>
            </Button>}
          </Tooltip>
          {state || sState ? <div className={style[`docSearchState_${state || sState}`]}>
            {STATE_MAP[state || sState]}
          </div> : null}
          <div className={style.inputWrapper}>
            <input
              id='gSearchInput'
              ref={(input) => this.input = input}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              className={style.input}
              autoComplete='off'
              autoCorrect='off'
              value={q || sQ}
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
        <Dropdown.Menu className={cx(style.searchBoxMenu, active && !loading && hits.length && style.scrollY)}>
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
      onToggle : toggleSearch,
      onTextInput,
      toggleAdvancedMode,
      onState,
      onClear,
      merge,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  withRouter,
  Connect,
  DataLoader.searchDocs,
)(SearchBox);

