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

import Form from './PaymentForm';

const CONFIRM_MSG = <div style={style.confirmToastr}>
  <h5>Êtes-vous sûr?</h5>
</div>;

class PaymentSetter extends React.Component {
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
          const { amount, date } = info.toJS();
          self.props.onSetPayment({
            date   : new Date(date).getTime(),
            amount : parseFloat(amount),
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
          self.props.onDeletePayment();
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

    const edit = (
      <div className={style.docSetPayment} style={styles.action1}>
        <Dropdown open={this.state.open} onToggle={this.onToggle}>
          <Dropdown.Toggle bsStyle='link' componentClass={Button} className={style.docSetPaymentButton}>
            {doc.payment ? <PencilIcon size={18}/> : 'Ajouter le paiement…'}
          </Dropdown.Toggle>
          <Dropdown.Menu className={style.docSetPaymentFormMenu}>
            <MenuItem
              componentClass={Form}
              onSubmit={this.onSet}
              initialValues={{
                date   : doc.payment ? new Date(doc.payment.date) : new Date(),
                amount : doc.payment ? doc.payment.amount : null,
              }}
              onInputRef={this.onInputRef}
            />
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );

    const del = doc.payment ? (
      <div className={style.docDelPayment} style={styles.action2}>
        <Button bsStyle='link' className={style.docDelPaymentButton} onClick={this.onDelete} role='button'>
          <TrashIcon size={18}/>
        </Button>
      </div>
    ) : null;

    const info = doc.payment ? (
      <div style={styles.info}>
        {[
          doc.payment.amount ? <div style={{display: 'inline'}}>{intl.formatNumber(doc.payment.amount, { format: 'MAD' })}</div> : null,
          doc.payment.amount && doc.payment.date ? <div style={styles.dot}>·</div> : null,
          doc.payment.date ? <div style={{display: 'inline'}}>{intl.formatDate(doc.payment.date)}</div> : null,
        ]}
      </div>
    ) : (doc.deletion || doc.state === 'CLOSED' || doc.state === 'CANCELED' ? '—' : null);

    return (
      <div style={styles.root} className={style.filterGroup}>
        {info}
        {doc.deletion || doc.state === 'CLOSED' || doc.state === 'CANCELED' ? null : [
          doc.payment ? <div style={styles.dot}>·</div> : null,
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
  display: 'inline',
};

export default compose(
  injectIntl,
)(PaymentSetter);

