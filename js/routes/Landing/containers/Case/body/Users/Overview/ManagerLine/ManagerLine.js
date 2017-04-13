import React from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Loading from '../Loading';

import DataLoader from 'routes/Landing/DataLoader';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import selector from './selector';

import ManagerChanger from './ManagerChanger';

const LABEL = 'Gestionnaire';

class ManagerLine extends React.Component {
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
          <ManagerChanger doc={doc} manager={user}/>
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
)(ManagerLine);

