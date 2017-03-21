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
    const { onInput, queryString, loading = false, result = { hits: [] }, onUser } = this.props;

    let content = <li className={style.noResults}>Aucun résultat</li>;
    if (loading) {
      content = queryString ? null : content;
    } else if (result.hits.length > 0) {
      content = result.hits.map(({ _id, _source : user }) => (
        <li className={style.result}>
          <MenuItem onClick={onUser.bind(null, _id)} className={style.userLine} role='button'>
            <span style={{ marginRight: 5 }}>
              <ProfilePic size={18} user={{ displayName : user.name }}/>
            </span>
            <span className={style.text}>
              <Highlighter
                highlightClassName={style.hit}
                searchWords={[queryString]}
                textToHighlight={user.name}
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
  DataLoader.esUsersByRoles(...roles),
)(PickUser);

