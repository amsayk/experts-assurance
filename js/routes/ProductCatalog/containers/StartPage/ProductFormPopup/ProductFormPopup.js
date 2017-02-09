import React, { PropTypes as T } from 'react';
import { compose } from 'redux';

import { withApollo } from 'react-apollo';

import Title from 'components/Title';

import Button from 'components/bootstrap/Button';

import messages from '../../../messages';

import style from '../../../ProductCatalog.scss';

import { APP_NAME } from 'vars';

import isEmpty from 'isEmpty';

import { SubmissionError, Field, reduxForm, propTypes as formPropTypes } from 'redux-form/immutable';

import validations from './validations';

import { injectIntl, intlShape } from 'react-intl';

import ProductNameField from '../../../components/ProductNameField';
import BrandNameField from '../../../components/BrandNameField';

import MUTATION from './addProduct.mutation.graphql';

class ProductFormPopup extends React.Component {
  static propTypes = {
    ...formPropTypes,
    intl            : intlShape.isRequired,
    onClose         : T.func.isRequired,
    client          : T.shape({
      mutate: T.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.onSubmit  = this.onSubmit.bind(this);
    this.onKeyDown = this._onKeyDown.bind(this);
  }

  _onKeyDown(e) {
    if (e.key === 'Enter' && e.shiftKey === false) {
      const submit = this.props.handleSubmit(this.onSubmit);
      submit();
    }
  }

  async onSubmit(data) {
    const { data: { addProduct: { errors } } } = await this.props.client.mutate({
      mutation  : MUTATION,
      variables : { info: {
        displayName : data.get('displayName'),
        brandName   : data.get('brandName'),
        labels      : [],
      } },
    });

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }

    const { intl } = this.props;
    const { snackbar } = this.context;
    if (snackbar) {
      snackbar.show({
        message  : intl.formatMessage(messages.addProductSuccessNotification),
      });
    }

    this.props.onClose();
  }

  close = () => {
    const { dirty, onClose } = this.props;
    if (dirty) {
      confirm('Sure?') && onClose();
    } else {
      onClose();
    }
  };

  render() {
    const { intl, submitting, pristine } = this.props;
    return (
      <div className={style.popupProductForm} style={{ width: 500 }}>
        <Title title={intl.formatMessage(messages.addProductTitle, { appName : APP_NAME })} />
        <section className={style.productFormBody}>
          <Field
            autoFocus
            placeholder={'Product name'}
            component={ProductNameField}
            name={'displayName'}
            onKeyDown={this.onKeyDown}
          />
          <Field
            placeholder={'Brand name'}
            component={BrandNameField}
            name={'brandName'}
            onKeyDown={this.onKeyDown}
          />
        </section>
        <footer className={style.productFormActions}>
          <Button disabled={submitting || pristine} className={style.saveButton} role='button'>
            Save
          </Button>
          <Button disabled={submitting} className={style.cancelButton} onClick={this.close} role='button'>
            Cancel
          </Button>
        </footer>
      </div>
    );

  }
}

ProductFormPopup.contextTypes = {
  snackbar: T.shape({
    show: T.func.isRequired,
  }),
};

const WithForm = reduxForm({
  form : 'catalog.addProductPopup',
  ...validations,
});

export default compose(
  withApollo,
  injectIntl,
  WithForm,
)(
  ProductFormPopup,
);

