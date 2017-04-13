import React from 'react'

import {compose, bindActionCreators} from 'redux';
import { connect } from 'react-redux';

import Portal from 'react-portal';

import { PlusIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import { startAddingDoc, finishAddingDoc, saveNewDoc } from 'redux/reducers/app/actions';

import style from 'routes/Landing/styles';

import AddDocForm from './AddDocForm';

import selector from './selector';

class AddDoc extends React.Component {
  constructor() {
    super();

    this.onOpen = this.onOpen.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  get button() {
    const { addingDoc, actions } = this.props;

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
    } catch(e) {}
    finally {
      this.props.actions.startAddingDoc();
    }
  }
  onClose() {
    this.props.actions.finishAddingDoc();
    try {
      document.body.style.overflowY = 'visible';
    } catch(e) {}
  }
  render() {
    const { addingDoc, actions } = this.props;

    return (
      <Portal openByClickOn={this.button} onClose={this.onClose} onOpen={this.onOpen} isOpen={addingDoc}>
        <AddDocForm
          actions={actions}
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
      saveNewDoc,
      startAddingDoc,
      finishAddingDoc,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  Connect,
)(AddDoc);

