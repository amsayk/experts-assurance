import React, { PropTypes as T } from 'react';
import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from '../../Activation.scss';

import Header from '../Header';

import selector from './selector';

export class ActivationContainer extends React.PureComponent {
  render() {
    const { user, actions } = this.props;
    return (
      <div className={style.root}>
        <Header user={user} onLogOut={actions.logOut}/>
        <div className={style.center}>
        </div>
      </div>
    );
  }
}

ActivationContainer.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
    currentUser: T.object,
  }).isRequired,
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
)(ActivationContainer);

