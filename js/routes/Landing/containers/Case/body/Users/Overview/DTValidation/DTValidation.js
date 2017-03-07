import React from 'react';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Loading from '../Loading';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import selector from './selector';

class DTValidation extends React.Component {
  render() {
    const { intl, docLoading, doc } = this.props;

    if (docLoading) {
      return (
        <Loading/>
      );
    }

    if (!doc.validation) {
      return null;
    }

    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>DT Validation</div>
        <div className={style.overviewValue}>
          {intl.formatDate(doc.validation.date)}
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
)(DTValidation);

