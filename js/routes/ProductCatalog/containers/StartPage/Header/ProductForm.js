import React, { PropTypes as T } from 'react';

import Button from 'components/bootstrap/Button';

import style from '../../../ProductCatalog.scss';

import Trigger from 'components/react-components/Trigger';

import { intlShape } from 'react-intl';

function ProductFormPopup({}) {
  return (
    <div className={style.popupProductForm} style={{ width: 500, height: 600 }}>
      Product form
    </div>
  );
}

const popupAlign = {
  points: ['tl', 'tl'],
  offset: [0, 0],
};

export default function ProductForm({ intl, adding, startAdding, stopAdding }) {
  if (adding) {
    return (
      <Trigger
        onPopupVisibleChange={(visible) => visible || stopAdding()}
        destroyPopupOnHide
        popupVisible
        popupAlign={popupAlign}
        popup={() => <ProductFormPopup/>}
      >
        <span style={{ width: 117.094, height: 44 }}/>
      </Trigger>
    );
  } else {
    return (
      <Button className={style.addProductBtn} onClick={startAdding}>
        <span>Add product</span>
      </Button>

    );
  }
}

ProductForm.propTypes = {
  intl        : intlShape.isRequired,
  adding      : T.bool.isRequired,
  startAdding : T.func.isRequired,
  stopAdding  : T.func.isRequired,
};

