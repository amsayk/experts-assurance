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

function DeletionUser({ user }) {
  return (
    <span style={{ marginLeft: 5, display: 'flex', alignItems: 'center' }}>
      <span>
        Par{' '}
      </span>
      <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
        <span style={{ marginLeft: 5, display: 'flex', alignItems: 'center' }} className={style.text}>
          {user.displayName}
        </span>
      </Link>
    </span>
  );
}

function DeletionDate({ intl, date }) {
  return (
    <span style={{marginLeft: 6}}>
      {' '}le {intl.formatDate(date)}{' à '}{intl.formatTime(date)}
    </span>
  );
}

const LABEL = 'Suppression';

class DeletionLine extends React.Component {
  render() {
    const { intl, docLoading, doc, user, loading } = this.props;

    if (docLoading === true || (typeof loading === 'undefined') || loading === true) {
      return (
        <Loading width={LABEL.length}/>
      );
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>
          {LABEL}
        </div>
        <div className={style.overviewValue}>
          <DeletionUser
            intl={intl}
            user={user}
            deletion={doc.deletion}
          />
          <DeletionDate
            intl={intl}
            date={doc.deletion.date}
          />
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
)(DeletionLine);

