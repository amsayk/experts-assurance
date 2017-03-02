import React from 'react'
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import DataLoader from 'routes/Landing/DataLoader';

import Highlighter from 'react-highlight-words';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import style from 'routes/Landing/styles';

import selector from './selector';

import { search } from 'redux/reducers/cases/actions';

import ActivityIndicator from 'components/ActivityIndicator';

import ProfilePic from 'components/Profile/ProfilePic';

class PickUser extends React.Component {
  constructor() {
    super();

    this.onSearch = this.onSearch.bind(this);
  }
  onSearch(e) {
    this.props.actions.search(e.target.value);
  }
  render() {
    const { onInput, queryString, loading, users = [], onUser } = this.props;

    let content = <li className={style.noResults}>Aucun résultat</li>;
    if (loading) {
      content = queryString ? <ActivityIndicator size='small'/> : content;
    } else if (users.length > 0) {
      content = users.map((user) => (
        <li className={style.result}>
          <MenuItem onClick={onUser.bind(null, user.id)} className={style.userLine} role='button'>
            <span style={{ marginRight: 5 }}>
              <ProfilePic size={18} user={user}/>
            </span>
            <span className={style.text}>
              <Highlighter
                highlightClassName={style.hit}
                searchWords={[queryString]}
                textToHighlight={user.displayName}
              />
            </span>
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
            onChange={this.onSearch}
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

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ search }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default (...roles) => compose(
  Connect,
  DataLoader.usersByRoles(...roles),
)(PickUser);

