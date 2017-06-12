import React from 'react';
import { compose } from 'redux';

import { injectIntl } from 'react-intl';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';

import focusNode from 'focusNode';

import raf from 'requestAnimationFrame';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { TrashIcon, PencilIcon } from 'components/icons/MaterialIcons';

import Button from 'components/bootstrap/Button';

import { Role_ADMINISTRATORS, Role_MANAGERS } from 'roles';

import { toastr } from 'containers/Toastr';

import Form from './MTRapportsForm';

const CONFIRM_MSG = <div style={style.confirmToastr}>
  <h5>Êtes-vous sûr?</h5>
  </div>;

class MTRapportsSetter extends React.Component {
  state ={
    open : false,
  };
  constructor() {
    super();

    this.onToggle = this.onToggle.bind(this);
    this.onSet = this.onSet.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.onInputRef = this.onInputRef.bind(this);
  }
  onToggle() {
    this.setState(({ open }, { doc }) => ({
      open : doc.deletion || doc.state === 'CLOSED' || doc.state === 'CANCELED' ? false : !open,
    }), () => {
      if (this.state.open) {
        raf(() => focusNode(this._input));
      }
    });
  }
  onInputRef(ref) { this._input = ref }
  onSet(info) {
    const self = this;
    if (!self.state.busy) {
      toastr.confirm(CONFIRM_MSG, {
        cancelText : 'Non',
        okText     : 'Oui',
        onOk       : () => {
          self.setState({
            open : false,
          });
          const { amount } = info.toJS();
          self.props.onSetMTRapports({
            amount,
          });
        },
      });
    }
  }
  onDelete() {
    const self = this;
    if (!self.state.busy) {
      toastr.confirm(CONFIRM_MSG, {
        cancelText : 'Non',
        okText     : 'Oui',
        onOk       : () => {
          self.props.onDeleteMTRapports();
        },
      });
    }
  }
  render() {
    const {
      intl,
      currentUser,
      busy,
      doc,
      user,
      actions,
    } = this.props;

    const canMutate = currentUser.isAdmin || currentUser.isManager(doc);

    const hasAmount = doc.validation && doc.validation.amount !== null && doc.validation.amount !== undefined;

    const edit = canMutate ? (
      <div className={style.docSetMTRapports} style={styles.action1}>
        <Dropdown open={this.state.open} onToggle={this.onToggle}>
          <Dropdown.Toggle bsStyle='link' componentClass={Button} className={style.docSetMTRapportsButton}>
            {hasAmount ? <PencilIcon size={18}/> : 'Ajouter le montant de rapports…'}
          </Dropdown.Toggle>
          <Dropdown.Menu className={style.docSetMTRapportsFormMenu}>
            <MenuItem
              componentClass={Form}
              onSubmit={this.onSet}
              initialValues={{
                amount   : doc.validation ? doc.validation.amount : null,
              }}
              onInputRef={this.onInputRef}
            />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    ) : null;

    const del = canMutate && hasAmount ? (
      <div className={style.docDelMTRapports} style={styles.action2}>
        <Button bsStyle='link' className={style.docDelMTRapportsButton} onClick={this.onDelete} role='button'>
          <TrashIcon size={18}/>
        </Button>
      </div>
    ) : null;

    const info = hasAmount ? (
      <div style={styles.info}>
        {intl.formatNumber(doc.validation.amount, { format: 'MAD' })}
      </div>
    ) : (doc.deletion || doc.state === 'CLOSED' || doc.state === 'CANCELED' ? '—' : null);

    return (
      <div style={styles.root} className={style.filterGroup}>
        {info}
        {doc.deletion || doc.state === 'CLOSED' || doc.state === 'CANCELED' ? null : [
          hasAmount ? <div style={styles.dot}>·</div> : null,
          edit,
          del,
        ]}
      </div>
    );
  }
}

const styles = {};

styles.root = {
  display : 'flex',
  flexDirection : 'row',
};

styles.action1 = {
};

styles.action2 = {
  marginLeft : 6,
};

styles.info = {
};

styles.dot = {
  opacity : 0.54,
  marginLeft : 6,
  marginRight : 6,
};

export default compose(
  injectIntl,
)(MTRapportsSetter);

