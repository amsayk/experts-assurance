import React, { PropTypes as T } from 'react';

import cookie from 'react-cookie';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { PATH_CASES, PATH_CASES_CASE_PARAM } from 'vars';

import Title from 'components/Title';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Landing/styles';

import Header from '../../Header';

import selector from './selector';

import Body from '../body';

import Timeline from '../../Timeline';

import Files from '../Files';

import Observations from '../Observations';

import { APP_NAME } from 'vars';

import { SECURE } from 'vars';

const KEY = 'timeline.key';

export class CaseContainer extends React.PureComponent {
  state: State = {
    nav : 'case.overview',
  };
  constructor() {
    super();

    this.onNav = this.onNav.bind(this);

    this.state = {
      selectedNavItem : function () {
        try {
          const value = cookie.load(KEY, /* doNotParse = */false);

          if (typeof value !== 'undefined' && value !== null) {
            if (typeof value === 'string') {
              return value;
            } else {
              cookie.remove(KEY);
            }
          }

          return 'timeline.events';
        } catch (e) {
          cookie.remove(KEY);
          return 'timeline.events';
        }
      }(),
    }
  }

  onNav(selectedNavItem) {
    this.setState({
      selectedNavItem,
    }, () => {
      setTimeout(() => {
        cookie.save(KEY, this.state.selectedNavItem, { path: '/', httpOnly: false, secure: SECURE });
      }, 0);
    });
  }
  getChildContext() {
    return {
      currentUser : this.props.user,
      route       : this.props.route,
    };
  }
  render() {
    const { user, actions, nav, params : { [PATH_CASES_CASE_PARAM] : id } } = this.props;
    return (
      <div className={style.root}>
        <Title title={`Dossiers · ${APP_NAME}`}/>
        <Header
          id={id}
          user={user}
          onLogOut={actions.logOut}
        />
        <Body
          user={user}
          id={id}
          nav={this.state.nav}
        />
        {(() => {
          if (this.state.selectedNavItem === 'timeline.files') {
            return (
              <Files onNav={this.onNav} id={id}/>
            );
          }
          if (this.state.selectedNavItem === 'timeline.events') {
            return (
              <Timeline onNav={this.onNav} id={id}/>
            );
          }
          if (this.state.selectedNavItem === 'timeline.comments') {
            return (
              <Observations onNav={this.onNav} id={id}/>
            );
          }
        })()}
      </div>
    );
  }
}

type State = {
  nav : 'case.overview' | 'case.files' | 'case.messages',
};

CaseContainer.childContextTypes = {
  currentUser : T.object.isRequired,
  route       : T.object.isRequired,
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

