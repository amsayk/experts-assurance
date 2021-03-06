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

class PickManager extends React.Component {
  constructor() {
    super();

    this.onSearch = this.onSearch.bind(this);
  }
  onSearch(e) {
    this.props.onSearch(e.target.value);
  }
  render() {
    const { onInput, selectedUserId, queryString, loading = false, result = { hits: [] }, onUser, onAction } = this.props;

    function isSelected (id) {
      return selectedUserId === id;
    }

    let content = <li className={style.noResults}>Aucun résultat</li>;
    if (loading) {
      content = queryString ? null : content;
    } else if (result.hits.length > 0) {
      content = result.hits.map(({ _id, _source : user }) => {
        return (
          <li className={style.result}>
            <MenuItem
              onClick={onUser.bind(null, _id)}
              className={cx(style.userLine, isSelected(_id) && style.userLineIsSelected)}
              role='button'
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: 5, display: 'flex', alignItems: 'center' }}>
                  {isSelected(_id)
                    ? <CircleIcon.Checked className={cx(style.isSelected, style.checkbox)} size={24}/>
                    : <CircleIcon.Blank size={24}/>}
                  </span>
                  <span className={style.text}>
                    <Highlighter
                      highlightClassName={style.hit}
                      searchWords={[queryString]}
                      textToHighlight={user.name}
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
  DataLoader.esUsersByRoles(...roles),
)(PickManager);

