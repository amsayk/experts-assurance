import React from 'react';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import selector from './selector';

import {
  Stage_UPLOAD,
  Stage_VALIDATION,
} from 'redux/reducers/importation/constants';

import Dialog from '../Dialog';

import Files from '../Files';
import Docs from '../Docs';
import Upload from '../Upload';

class Controller extends React.Component {
  constructor(props) {
    super(props);

    const { stage, onRef } = props;

    let rendered;

    switch (stage) {
      case Stage_UPLOAD:
        rendered = <Upload ref={onRef} />;
        break;

      case Stage_VALIDATION:
        rendered = <Docs ref={onRef} />;
        break;

      default:
        rendered = <Files ref={onRef} />;
    }

    this.state = {
      rendered,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { stage } = nextProps;
    let rendered;

    switch (stage) {
      case Stage_UPLOAD:
        rendered = <Upload ref={this.props.onRef} />;
        break;

      case Stage_VALIDATION:
        rendered = <Docs ref={this.props.onRef} />;
        break;

      default:
        rendered = <Files ref={this.props.onRef} />;
    }

    this.setState({
      rendered,
    });
  }
  render() {
    const { visible, ...props } = this.props;

    return (
      <Dialog {...props} show={visible}>
        {this.state.rendered}
      </Dialog>
    );
  }
}

Controller.propTypes = {};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Controller);
