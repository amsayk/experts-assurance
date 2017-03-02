import React from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER } from 'vars';

import Loading from '../Loading';

import { injectIntl } from 'react-intl';

import StateChanger from './StateChanger';

import style from 'routes/Landing/styles';

import selector from './selector';

function StateUser({ doc }) {
  let user = doc.user;

  if (doc.state === 'OPEN' && doc.validation) {
    user = doc.validation.user;
  }

  if ((doc.state === 'INVALID' || doc.state === 'CLOSED') && doc.closure) {
    user = doc.closure.user;
  }

  if (doc.insurer ? doc.insurer.id === user.id : false) {
    return null;
  }

  return (
    <span style={{ marginLeft: 5 }}>
      par{' '}
      <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + user.id}>
        <span className={style.text}>
          {user.displayName}
        </span>
      </Link>
    </span>
  );
}

function StateDate({ intl, doc }) {
  let date = doc.date;

  if (doc.validation) {
    date = doc.validation.date;
  }

  if (doc.closure) {
    date = doc.closure.date;
  }
  return (
    <span title={intl.formatDate(date)}>
      {' '}{intl.formatRelative(date)}
    </span>
  );
}

class StateLine extends React.Component {
  render() {
    const { intl, docLoading, doc, user } = this.props;

    if (docLoading) {
      return (
        <Loading/>
      );
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>État</div>
        <div className={style.overviewValueState}>
          <StateChanger state={doc.state}/>
          <StateUser doc={doc}/>
          <StateDate intl={intl} doc={doc}/>
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
)(StateLine);

