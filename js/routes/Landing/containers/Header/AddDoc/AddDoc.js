import React, { PropTypes as T } from 'react';

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Portal from 'react-portal';

import { PlusIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import { startAddingDoc, finishAddingDoc } from 'redux/reducers/app/actions';

import focusNode from 'focusNode';
import raf from 'utils/requestAnimationFrame';

import style from 'routes/Landing/styles';

import AddDocForm from './AddDocForm';

import selector from './selector';

class AddDoc extends React.Component {
  constructor(props) {
    super(props);

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onDTField = this.onDTField.bind(this);

  }

  onDTField(ref) {
    this.dateField = ref;
  }

  get AddButton() {
    const { addingDoc } = this.props;

    return (
      <Button disabled={addingDoc} className={style.addButton} role='button'>
        <div>
          <PlusIcon size={32} />
          <span>
            Nouveau Dossier
          </span>
        </div>
      </Button>
    )
  }
  onOpen() {
    try {
      document.body.style.overflowY = 'hidden';
      this.props.actions.startAddingDoc();
      setTimeout(() => {
        raf(
          () => {
            focusNode(this.dateField);
          }
        );
      }, 1000);
    } catch (e) {}
  }
  onClose() {
    this.props.actions.finishAddingDoc();
    try {
      document.body.style.overflowY = 'visible';
    } catch (e) {}

  }
  render() {
    const { addingDoc, actions } = this.props;

    return (
      <Portal openByClickOn={this.AddButton} onClose={this.onClose} onOpen={this.onOpen} isOpened={addingDoc}>
        <AddDocForm
          addingDoc={addingDoc}
          initialValues={{
            dateMission   : Date.now(),
            date          : Date.now(),
          }}
          actions={actions}
          onDTField={this.onDTField}
        />
      </Portal>
    );

  }
}

AddDoc.propTypes = {
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      startAddingDoc,
      finishAddingDoc,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(AddDoc);

