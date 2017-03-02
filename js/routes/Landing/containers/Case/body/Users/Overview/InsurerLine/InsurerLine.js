import React from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Loading from '../Loading';

import DataLoader from 'routes/Landing/DataLoader';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import selector from './selector';

// import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

import InsurerChanger from './InsurerChanger';

class InsurerLine extends React.Component {
  render() {
    const { intl, docLoading, user, loading } = this.props;

    if (docLoading === true || (typeof loading === 'undefined') || loading === true) {
      return (
        <Loading/>
      );
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>
          Agent
        </div>
        <div className={style.overviewValue}>
          {/* {user ? <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}> */}
            {/*   <div style={{ display: 'flex', alignItems: 'center' }}> */}
              {/*     <span className={style.text}> */}
                {/*       {user.displayName} */}
                {/*     </span> */}
              {/*   </div> */}
            {/* </Link> : 'Non affecté'} */}
          <InsurerChanger insurer={user}/>
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
)(InsurerLine);

