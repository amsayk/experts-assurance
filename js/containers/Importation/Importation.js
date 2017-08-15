import React from 'react';
import T from 'prop-types';

import EventListener from 'react-event-listener';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Portal from 'react-portal';

import getDataTransferItems from 'getDataTransferItems';

import accepts from 'attr-accept';

import Button from 'components/bootstrap/Button';

import { boot, show, hide } from 'redux/reducers/importation/actions';

import { ACCEPT } from 'redux/reducers/importation/constants';

import { ImportIcon } from 'components/icons/MaterialIcons';

import raf from 'utils/requestAnimationFrame';

import Controller from './Controller';

import style from 'containers/Importation/styles';

import cx from 'classnames';

import selector from './selector';

import { SERVER } from 'vars';

function fileAccepted(file, accept) {
  // Firefox versions prior to 53 return a bogus MIME type for every file drag, so dragovers with
  // that MIME type will always be accepted
  return file.type === 'application/x-moz-file' || accepts(file, accept);
}

class Importation extends React.Component {
  constructor(props) {
    super(props);

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onControllerLoaded = this.onControllerLoaded.bind(this);
    this.onDocumentDragEnter = this.onDocumentDragEnter.bind(this);
  }

  componentWillMount() {
    this.props.actions.boot();
  }

  onDocumentDragEnter(e) {
    e.preventDefault();
    const files = getDataTransferItems(e);
    if (files.length && files.every(f => fileAccepted(f, ACCEPT))) {
      this.props.actions.show();
    }
  }

  onControllerLoaded(ref) {
    this.controller = ref;
  }
  get ImportButton() {
    const { visible, importing } = this.props;

    return (
      <div
        className={cx(
          style.importButtonWrapper,
          importing && style.importButtonWrapper_importing,
        )}
      >
        {SERVER || visible
          ? null
          : <EventListener
              target={document}
              onDragEnter={this.onDocumentDragEnter}
            />}
        <Button disabled={visible} className={style.importButton} role='button'>
          <div>
            <ImportIcon size={36} />
          </div>
        </Button>
      </div>
    );
  }

  onOpen() {
    try {
      document.body.style.overflowY = 'hidden';
      this.props.actions.show();
      setTimeout(() => {
        raf(() => {
          this.controller && this.controller.onOpen();
        });
      }, 100);
    } catch (e) {}
  }
  onClose() {
    this.props.actions.hide();
    try {
      document.body.style.overflowY = 'visible';
    } catch (e) {}
  }
  render() {
    const { visible, actions } = this.props;

    return (
      <Portal
        openByClickOn={this.ImportButton}
        onClose={this.onClose}
        onOpen={this.onOpen}
        isOpened={visible}
      >
        <Controller onRef={this.onControllerLoaded} />
      </Portal>
    );
  }
}

Importation.propTypes = {};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        boot,
        show,
        hide,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Importation);
