import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logOut } from 'redux/reducers/user/actions';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import Title from 'components/Title';

import Header from '../../Header';

import selector from './selector';

import Body from '../body';

import Timeline from '../../Timeline';

import { APP_NAME } from 'vars';

export class CasesContainer extends React.PureComponent {
  getChildContext() {
    return {
      currentUser: this.props.user,
      route: this.props.route,
    };
  }
  render() {
    const { user, timelineDisplayMatches, actions } = this.props;
    return (
      <div
        className={cx(
          style.root,
          !timelineDisplayMatches && style.timelineDisplayMismatches,
        )}
      >
        <Title title={`Dossiers · ${APP_NAME}`} />
        <Header user={user} onLogOut={actions.logOut} />
        <Body user={user} />
        <Timeline />
      </div>
    );
  }
}

CasesContainer.propTypes = {};

CasesContainer.childContextTypes = {
  currentUser: T.object.isRequired,
  route: T.object.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ logOut }, dispatch) };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(CasesContainer);
