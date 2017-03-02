import React, { PropTypes as T } from 'react';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { PATH_CASES, PATH_CASES_CASE_PARAM } from 'vars';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Landing/styles';

import Header from '../../Header';
import Nav from '../Nav';

import selector from './selector';

import Body from '../body';

import Timeline from '../../Timeline';

export class CaseContainer extends React.PureComponent {
  state: State = {
    nav : 'case.overview',
  };
  constructor() {
    super();

    this.onNav = this.onNav.bind(this);
  }
  onNav(nav) {
    this.setState({
      nav,
    });
  }
  getChildContext() {
    return {
      currentUser : this.props.user,
    };
  }
  render() {
    const { user, actions, nav, params : { [PATH_CASES_CASE_PARAM] : id } } = this.props;
    return (
      <div className={style.root}>
        <Header
          id={id}
          user={user}
          onLogOut={actions.logOut}
        />
        <Nav
          id={id}
          user={user}
          onNav={this.onNav}
          selectedNavItem={this.state.nav}
        />
        <Body
          user={user}
          id={id}
          nav={this.state.nav}
        />
        <Timeline id={id}/>
      </div>
    );
  }
}

type State = {
  nav : 'case.overview' | 'case.files' | 'case.messages',
};

CaseContainer.childContextTypes = {
  currentUser : T.object.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ logOut }, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(CaseContainer);

