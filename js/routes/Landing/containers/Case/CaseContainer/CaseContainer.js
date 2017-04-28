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

import { APP_NAME } from 'vars';

const KEY = 'timeline.key';

export class CaseContainer extends React.PureComponent {
  state: State = {
    nav : 'case.overview',
  };
  constructor() {
    super();

    this.onNav = this.onNav.bind(this);

    this.state = {
      showFiles : function () {
        const value = cookie.load(KEY, /* doNotParse = */false);

        if (typeof value === 'undefined' || value !== null) {
          return value === 1;
        }

        return true;
      }(),
    }
  }

  onNav(selectedNavItem) {
    this.setState({
      showFiles : selectedNavItem === 'timeline.files',
    }, () => {
      setTimeout(() => {
        cookie.save(KEY, this.state.showFiles ? 1 : 0);
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
        {this.state.showFiles
            ? <Files onNav={this.onNav} id={id}/>
            : <Timeline onNav={this.onNav} id={id}/>}
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

