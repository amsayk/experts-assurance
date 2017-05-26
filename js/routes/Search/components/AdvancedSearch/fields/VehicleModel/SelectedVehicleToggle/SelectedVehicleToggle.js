import React from 'react'
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import DataLoader from 'routes/Search/DataLoader';

import { CloseIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import compact from 'lodash.compact';

import style from 'routes/Landing/styles';

function intersperse(a, delim) {
  let first = true;
  let ret = [];
  for (const x of a) {
    if (!first) ret.push(delim);
    first = false;
    ret.push(x);
  }
  return ret.join('');
}

class SelectedVehicleToggle extends React.Component {
  constructor() {
    super();

    this.onClear = this.onClear.bind(this);
    this.onClearOpen = this.onClearOpen.bind(this);
  }
  onClear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClear();
  }
  onClearOpen(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onClear();
    this.props.onOpen();
  }
  render() {
    const { loading, model } = this.props;

    const fields = compact([model]);
    // const { loading, vehicle = {} } = this.props;
    //
    // const fields = compact([vehicle.manufacturer, vehicle.model]);

    return (
      <Button onClick={this.onClear} className={style.selectedUserButton} role='button'>
        <div className={style.text} style={{ marginRight: 5 }}>
          {intersperse(fields, ', ')}
        </div>
        <CloseIcon className={style.closeIcon} size={12}/>
      </Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({}, dispatch)};
}

const Connect = connect(null, mapDispatchToProps);

export default compose(
  Connect,
  // DataLoader.vehicleByPlateNumber,
)(SelectedVehicleToggle);

