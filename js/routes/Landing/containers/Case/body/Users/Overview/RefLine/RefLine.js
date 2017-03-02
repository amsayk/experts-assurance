import React from 'react';
import { Link } from 'react-router';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import { PATH_CASES_CASE } from 'vars';

import Loading from '../Loading';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import selector from './selector';

class RefLine extends React.Component {
  render() {
    const { intl, docLoading, doc } = this.props;

    if (docLoading) {
      return (
        <Loading/>
      );
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>Réf</div>
        <div className={style.overviewValue}>
          <Link to={PATH_CASES_CASE + '/' + doc.id}>
            #{doc.refNo}
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
)(RefLine);

