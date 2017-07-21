import React from 'react';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import selector from './selector';

import { Stage_DOCS } from 'redux/reducers/importation/constants';

import Dialog from '../Dialog';

import Files from '../Files';
import Docs from '../Docs';
import Report from '../ImportReport';

class Controller extends React.Component {
  constructor(props) {
    super(props);

    const { id, stage, onRef } = props;

    let rendered = null;

    if (id) {
      rendered = (
        <Report ref={onRef} id={id}/>
      );
    } else {

      switch (stage) {
        case Stage_DOCS:
          rendered = (
            <Docs ref={onRef}/>
          );
          break;

        default:
          rendered = (
            <Files ref={onRef}/>
          );
      }
    }

    this.state = {
      rendered,
    };

  }
  componentWillReceiveProps(nextProps) {
    const { id, stage } = nextProps;
    if (id) {
      if (id !== this.props.id) {
        this.setState({
          rendered : <Report ref={this.props.onRef} id={id}/>,
        });
      }
    } else if (stage !== this.props.stage) {

      let rendered = null;

      switch (stage) {
        case Stage_DOCS:
          rendered = (
            <Docs ref={this.props.onRef}/>
          );
          break;

        default:
          rendered = (
            <Files ref={this.props.onRef}/>
          );
      }

      this.setState({
        rendered,
      });
    }
  }
  render() {
    const { importing, ...props } = this.props;

    return (
      <Dialog {...props} show={importing}>
        {this.state.rendered}
      </Dialog>
    );
  }
}

Controller.propTypes = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(Controller);

