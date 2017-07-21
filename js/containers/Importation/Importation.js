import React, { PropTypes as T } from 'react';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Portal from 'react-portal';

import Button from 'components/bootstrap/Button';

import { startImporting, finishImporting } from 'redux/reducers/importation/actions';

import { ImportIcon } from 'components/icons/MaterialIcons';

import raf from 'utils/requestAnimationFrame';

import Controller from './Controller';

import style from 'containers/Importation/styles';

import selector from './selector';

class Importation extends React.Component {
  constructor(props) {
    super(props);

    this.onOpen             = this.onOpen.bind(this);
    this.onClose            = this.onClose.bind(this);
    this.onControllerLoaded = this.onControllerLoaded.bind(this);

  }

  onControllerLoaded(ref) {
    this.controller = ref;
  }
  get ImportButton() {
    const { importing } = this.props;

    return (
      <div className={style.importButtonWrapper}>
        <Button disabled={importing} className={style.importButton} role='button'>
          <div>
            <ImportIcon size={36} />
          </div>
        </Button>
      </div>
    )
  }

  onOpen() {
    try {
      document.body.style.overflowY = 'hidden';
      this.props.actions.startImporting();
      setTimeout(() => {
        raf(
          () => {
            // this.controller && this.controller.onOpen();
          }
        );
      }, 100);
    } catch (e) {}
  }
  onClose() {
    this.props.actions.finishImporting();
    try {
      document.body.style.overflowY = 'visible';
    } catch (e) {}

  }
  render() {
    const { importing, actions } = this.props;

    return (
      <Portal openByClickOn={this.ImportButton} onClose={this.onClose} onOpen={this.onOpen} isOpened={importing}>
        <Controller
          onRef={this.onControllerLoaded}
        />
      </Portal>
    );

  }
}

Importation.propTypes = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      startImporting,
      finishImporting,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(Importation);

