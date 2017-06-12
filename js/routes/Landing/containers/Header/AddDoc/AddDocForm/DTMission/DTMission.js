import React from 'react'
import {compose} from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import {
  getFormValues,
} from 'redux-form/immutable';

import DT from '../DT';

class DTMission extends React.Component {
  static displayName = 'DT(DTMission)';

  static contextTypes = {

  };

  render() {
    const { date, ...props } = this.props;
    return (
      <DT {...props} minDate={date}/>
    );
  }
}

const getDTMission = state => {
  const values = getFormValues('addDoc')(state);
  return values ? values.get('date') : null;
};

const selector = createSelector(
  getDTMission,
  (date) => ({ date }),
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(
  Connect,
)(DTMission);

