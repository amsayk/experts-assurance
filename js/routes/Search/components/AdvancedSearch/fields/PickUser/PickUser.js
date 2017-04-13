import React from 'react'
import { compose } from 'redux';

import DataLoader from 'routes/Landing/DataLoader';

import Highlighter from 'react-highlight-words';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import style from 'routes/Landing/styles';

import ProfilePic from 'components/Profile/ProfilePic';

function pickerState(Component) {
  return class extends React.Component {
    state = {
      queryString: '',
    };

    constructor() {
      super()

      this.onSearch = this.onSearch.bind(this);
      this.onUser = this.onUser.bind(this);
    }

    onUser(id) {
      this.props.onUser(id);
      this.setState({
        queryString: '',
      });
    }

    onSearch(e) {
      this.setState({
        queryString : e.target.value,
      })
    }

    render() {
      return (
        <Component
          onSearch={this.onSearch}
          queryString={this.state.queryString}
          {...this.props}
          onUser={this.onUser}
        />
      )
    }
  }
}

class PickUser extends React.Component {

  render() {
    const {
      onInput,
      onSearch,
      queryString,
      loading = false,
      result = { hits: [] },
      onUser,
    } = this.props;

    let content = <li className={style.noResults}>Aucun résultat</li>;
    if (loading) {
      content = queryString ? null : content;
    } else if (result.hits.length > 0) {
      content = result.hits.map(({ _id, _source : user }) => (
        <li className={style.result}>
          <MenuItem onClick={onUser.bind(null, _id)} className={style.userLine} role='button'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 5, display: 'flex', alignItems: 'center' }}>
                <ProfilePic size={18} user={{ displayName : user.name }}/>
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
      ))
    }

    return (
      <div className={style.pickUser} style={{}}>
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
            onChange={onSearch}
          />
        </div>
        <div className={style.results}>
          <ul>
            {content}
          </ul>
        </div>
      </div>
    );
  }
}

export default (...roles) => compose(
  pickerState,
  DataLoader.esUsersByRoles(...roles),
)(PickUser);

