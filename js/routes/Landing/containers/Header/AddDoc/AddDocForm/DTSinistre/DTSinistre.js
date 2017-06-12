import React from 'react'
import {compose} from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import moment from 'moment';

import {
  change,
  getFormValues,
} from 'redux-form/immutable';

import DT from '../DT';

class DTSinistre extends React.Component {
  static displayName = 'DT(DTSinistre)';

  static contextTypes = {

  };

  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
  }
  onChange(value) {
    const { dispatch, input, dateMission } = this.props;
    input.onChange(value);
    dispatch(change(
      'addDoc', 'dateMission', +moment.max(moment(value), moment(dateMission)),
    ));

  }
  render() {
    const { input, ...props } = this.props;
    delete props.dateMission;
    return (
      <DT
        {...props}
        input={{...input, onChange : this.onChange}}
      />
    );
  }
}

const getDTMission = state => {
  const values = getFormValues('addDoc')(state);
  return values ? values.get('dateMission') : null;
};

const selector = createSelector(
  getDTMission,
  (dateMission) => ({ dateMission }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(
  Connect,
)(DTSinistre);

