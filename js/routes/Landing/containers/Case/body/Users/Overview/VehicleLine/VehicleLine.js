import React from 'react';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Loading from '../Loading';

import { injectIntl } from 'react-intl';

import style from 'routes/Landing/styles';

import selector from './selector';

const LABEL = 'Vehicle (Modèle, Immatriculation)';

class VehicleLine extends React.Component {
  render() {
    const { intl, docLoading, doc } = this.props;

    if (docLoading) {
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
          {doc.vehicle.model}, {doc.vehicle.plateNumber}
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
)(VehicleLine);

