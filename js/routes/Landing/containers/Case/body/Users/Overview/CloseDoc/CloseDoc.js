import React, { PropTypes as T } from 'react'

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Portal from 'react-portal';

import { PlusIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import { finishClosingDoc } from 'redux/reducers/app/actions';

import focusNode from 'focusNode';
import raf from 'requestAnimationFrame';

import style from 'routes/Landing/styles';

import CloseDocForm from './CloseDocForm';

import selector from './selector';

class CloseDoc extends React.Component {
  constructor(props) {
    super(props);

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onFirstChild = this.onFirstChild.bind(this);

  }

  onFirstChild(ref) {
    this.firstChild = ref;
  }

  onOpen() {
    try {
      document.body.style.overflowY = 'hidden';
      setTimeout(() => {
        raf(
          () => {
            focusNode(this.firstChild);
          }
        );
      }, 100);
    } catch (e) {}
  }
  onClose() {
    this.props.actions.finishClosingDoc();
    try {
      document.body.style.overflowY = 'visible';
    } catch (e) {}

  }
  render() {
    const { closingDoc, doc, actions } = this.props;

    return (
      <Portal onClose={this.onClose} onOpen={this.onOpen} isOpened={closingDoc}>
        <CloseDocForm
          doc={doc}
          closingDoc={closingDoc}
          initialValues={{
            // dateValidation : Date.now(),
            dateClosure    : Date.now(),

            paymentAmount  : doc.payment ? doc.payment.amount : null,
            paymentDate    : doc.payment ? doc.payment.date   : null,
          }}
          actions={actions}
          onFirstChild={this.onFirstChild}
        />
      </Portal>
    );

  }
}

CloseDoc.propTypes = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      finishClosingDoc,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(CloseDoc);

