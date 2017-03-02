import React from 'react'
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import DataLoader from 'routes/Landing/DataLoader';

import { CircleIcon } from 'components/icons/MaterialIcons';

import Highlighter from 'react-highlight-words';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import cx from 'classnames';

import style from 'routes/Landing/styles';

import ActivityIndicator from 'components/ActivityIndicator';

class PickInsurer extends React.Component {
  constructor() {
    super();

    this.onSearch = this.onSearch.bind(this);
  }
  onSearch(e) {
    this.props.onSearch(e.target.value);
  }
  render() {
    const { onInput, selectedUserId, queryString, loading, users = [], onUser, onAction } = this.props;

    function isSelected (id) {
      return selectedUserId === id;
    }

    let content = <li className={style.noResults}>Aucun résultat</li>;
    if (loading) {
      content = queryString ? <ActivityIndicator size='small'/> : content;
    } else if (users.length > 0) {
      content = users.map((user) => {
        return (
          <li className={style.result}>
            <MenuItem
              onClick={onUser.bind(null, user.id)}
              className={cx(style.userLine, isSelected(user.id) && style.userLineIsSelected)}
              role='button'
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: 5 }}>
                  {isSelected(user.id)
                    ? <CircleIcon.Checked size={24}/>
                    : <CircleIcon.Blank size={24}/>}
                  </span>
                  <span className={style.text}>
                    <Highlighter
                      highlightClassName={style.hit}
                      searchWords={[queryString]}
                      textToHighlight={user.displayName}
                    />
                  </span>
                </div>
              </MenuItem>
            </li>
        );
      });
    }

    return (
      <div className={style.pickUser} style={{ width: 275 }}>
        <div className={style.search}>
          <input
            ref={onInput}
            type='text'
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            className={style.input}
            value={queryString}
            onChange={this.onSearch}
          />
        </div>
        <div className={style.results}>
          <ul>
            {content}
          </ul>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid #ccc' }} className={style.search}>
          <Button onClick={onAction} disabled={selectedUserId === null} bsStyle='danger' role='button'>
            Affecter cet utilisateur
          </Button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(null, mapDispatchToProps);

export default (...roles) => compose(
  Connect,
  DataLoader.usersByRoles(...roles),
)(PickInsurer);

