import React, { PropTypes as T } from 'react';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Landing/styles';

import Header from '../Header';
import Nav from 'routes/Landing/components/Nav';

import selector from './selector';

export class DashboardContainer extends React.PureComponent {
  render() {
    const { user, actions } = this.props;
    return (
      <div className={style.root}>
        <Header user={user} onLogOut={actions.logOut}/>
        <Nav user={user} selectedNavItem='app.dashboard'/>
        <div className={style.content}>
          <div className={style.center}>
            Tableaux de bords
          </div>
        </div>
      </div>
    );
  }
}

DashboardContainer.propTypes = {
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
)(DashboardContainer);

