import React, { PropTypes as T } from 'react';

import Button from 'components/bootstrap/Button';

import style from '../../../ProductCatalog.scss';

import Trigger from 'components/react-components/Trigger';

import { intlShape } from 'react-intl';

import ProductFormPopup from '../ProductFormPopup';

const popupAlign = {
  points: ['tl', 'tl'],
  offset: [0, 0],
};

export default function ProductFormButton({ intl, adding, startAdding, stopAdding }) {
  if (adding) {
    return (
      <Trigger
        mask
        onPopupVisibleChange={(visible) => visible || stopAdding()}
        destroyPopupOnHide
        popupVisible
        popupAlign={popupAlign}
        popup={() => <ProductFormPopup onClose={stopAdding}/>}
      >
        <span className={style.addProduct} style={{ width: 117.094, height: 44 }}/>
      </Trigger>
    );
  } else {
    return (
      <div className={style.addProduct}>
        <Button className={style.addProductBtn} onClick={startAdding}>
          <span>Add product</span>
        </Button>
      </div>

    );
  }
}

ProductFormButton.propTypes = {
  intl        : intlShape.isRequired,
  adding      : T.bool.isRequired,
  startAdding : T.func.isRequired,
  stopAdding  : T.func.isRequired,
};

