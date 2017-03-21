import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import MenuItem from 'components/bootstrap/MenuItem';
import Dropdown from 'components/bootstrap/Dropdown';
import Button from 'components/bootstrap/Button';

import DataLoader from 'routes/Settings/containers/Business/Users/DataLoader';

import { CloseIcon, SearchIcon } from 'components/icons/MaterialIcons';

import Highlighter from 'react-highlight-words';

import raf from 'requestAnimationFrame';

import { intlShape } from 'react-intl';

import style from 'routes/Settings/styles';

import Tooltip from 'components/react-components/Tooltip';

import cx from 'classnames';

import ProfilePic from 'components/Profile/ProfilePic';

import {
  search,
} from 'redux/reducers/users/actions';

import {
  PATH_SETTINGS_BASE,
  PATH_SETTINGS_BUSINESS_USER,
} from 'vars';

import selector from './selector';

const tooltipAlign = {
  offset: [0, -4],
};

class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    this.onText = this.onText.bind(this);
    this.onClearSearch = this.onClearSearch.bind(this);
  }
  onText(e) {
    const q = e.target.value;
    raf(() => this.props.actions.search(q));
  }
  onClearSearch() {
    this.props.onClose();
    raf(() => this.props.actions.search(''));
  }
  render() {
    const { result, loading, queryString : q, intl, onClose } = this.props;
    return (
      <Dropdown componentClass={'div'} defaultOpen onClose={onClose} className={style.searchFieldWrapper} role='search'>
        <div className={cx(style.searchField, style.active, style.hasContent)}>
          <Button className={style.showResultsButton}>
            <SearchIcon size={18}/>
          </Button>
          <div className={style.inputWrapper}>
            <input
              className={style.input}
              autoFocus
              value={q}
              onChange={this.onText}
              autoComplete='off'
              autoCorrect='off'
              placeholder='Recherche des utilisateurs'
              type='text'
              spellCheck='false'
              style={{ outline: 'none' }}
            />
          </div>
          {q ? <Button onClick={this.onClearSearch} className={style.clearSearch} role='button'>
            <CloseIcon size={18}/>
          </Button> : null}
        </div>
        <Dropdown.Menu className={cx(style.searchBoxMenu, result.hits.length > 0 || style.hide)}>
          <MenuItem header componentClass={Header} title={'Résultat de recherche'}/>
          {result.hits.map(({ _id, _source : user }, index) => {
            return (
              <MenuItem q={q} url={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + _id} key={_id} eventKey={index} ProfilePic={ProfilePic} componentClass={ListItem} item={user} intl={intl}/>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

function Header({ title }) {
  return (
    <div className={style.menuSectionTitleRow}>
      <div className={style.menuSectionTitle}>
        <span>{title}</span>
      </div>
    </div>
  );
}

function ListItem({ intl, item, q, url, role }) {
  return (
    <div role={role} className={style.menuItem}>
      <Link to={url}>
        <div className={style.icon}>
          <span className={style.iconWrapper}>
            <ProfilePic user={{ displayName : item.name }}/>
            <span className={style.iconOverlay} />
          </span>
        </div>
        <div className={style.info}>
          <div className={style.title}>
            <span>
              <Highlighter
                highlightClassName={style.hit}
                searchWords={[q]}
                textToHighlight={item.name}
              />
            </span>
          </div>
          {item.lastModified ? <div className={style.subtitle}>
            <div className={style.entryByLine}>
              <span>
                <span className={style.timeAgo}>
                  {intl.formatRelative(item.lastModified)}
                </span>
              </span>
              <span>
              </span>
            </div>
          </div> : null}
        </div>
      </Link>
    </div>
  );
}

SearchBox.propTypes = {
  users: T.arrayOf(T.shape({
    id : T.string.isRequired,
    displayName : T.string.isRequired,
    email : T.string,
    createdAt : T.number.isRequired,
    updatedAt : T.number.isRequired,
  }).isRequired).isRequired,
  loading  : T.bool.isRequired,
  onClose  : T.func.isRequired,
  intl     : intlShape.isRequired,
};

SearchBox.defaultProps = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      search,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
  DataLoader.esSearch,
)(SearchBox);

