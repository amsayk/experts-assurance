import React from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Loading from '../Loading';

import DataLoader from 'routes/Landing/DataLoader';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import selector from './selector';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

const LABEL = 'Assuré';

class ClientLine extends React.Component {
  render() {
    const { intl, docLoading, user, loading } = this.props;

    if (docLoading === true || (typeof loading === 'undefined') || loading === true) {
      return (
        <Loading width={LABEL.length}/>
      );
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>{LABEL}</div>
        <div className={style.overviewValue}>
          <Link className={cx(style.selectedUserButton, style.togglePickUser, style.selectedManagerButton)} to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
            <div className={style.text}>
              {/* <span className={style.text}> */}
                {user.displayName}
              {/* </span> */}
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
  DataLoader.user,
)(ClientLine);

