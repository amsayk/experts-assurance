import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cx from 'classnames';
import ToastrConfirm from './ToastrConfirm';
import * as actions from 'redux/reducers/toastr/actions';
import {EE} from './toastrEmitter';
import {updateConfig} from './utils';
import {TRANSITIONS} from './constants';

import style from './styles';

export class ReduxToastr extends React.Component {
  static displayName = 'ReduxToastr';

  static propTypes = {
    position: PropTypes.string,
    confirmOptions: PropTypes.object,
    transitionIn: PropTypes.oneOf(TRANSITIONS.in),
    transitionOut: PropTypes.oneOf(TRANSITIONS.out),
  };

  static defaultProps = {
    position: 'top-right',
    timeOut: 5000,
    transitionIn: TRANSITIONS.in[0],
    transitionOut: TRANSITIONS.out[0],
    confirmOptions: {
      okText: 'ok',
      cancelText: 'Annuler'
    }
  };

  constructor(props) {
    super(props);
    updateConfig(props);
  }

  componentDidMount() {
    const {showConfirm} = this.props;
    EE.on('toastr/confirm', showConfirm);
  }

  componentWillUnmount() {
    EE.removeListener('toastr/confirm');
  }

  render() {
    const {className, toastr} = this.props;
    return (
      <span className={cx(style.reduxToastr, className)}>
        {toastr.confirm &&
          <ToastrConfirm
            confirm={toastr.confirm}
            {...this.props}
          />
        }
      </span>
    );
  }
}

export default connect(
  state => ({
    toastr: state.get('toastr', {}),
  }),
  actions
)(ReduxToastr);

