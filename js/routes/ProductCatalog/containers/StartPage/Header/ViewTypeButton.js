import React, { PropTypes as T } from 'react';

import Button from 'components/bootstrap/Button';

import Icon from 'components/icons/SimpleLineIcons';

import { intlShape } from 'react-intl';

import style from '../../../ProductCatalog.scss';

import Tooltip from 'components/react-components/Tooltip';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
} from 'redux/reducers/catalog/constants';

const align = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

export default function ViewTypeButton({ intl, viewType, viewTypeList, viewTypeGrid }) {
  return (
    <div className={style.viewType}>
      <Button className={style.viewTypeBtn} onClick={viewType === VIEW_TYPE_GRID ? viewTypeList : viewTypeGrid}>
        <Tooltip align={align} overlay={viewType === VIEW_TYPE_GRID ? 'List view' : 'Grid view'}>
        <Icon name={viewType === VIEW_TYPE_LIST ? 'list' : 'grid'} size={24}/>
      </Tooltip>
    </Button>
  </div>
  );
}

ViewTypeButton.propTypes = {
  viewTypeList : T.func.isRequired,
  viewTypeGrid : T.func.isRequired,
  viewType     : T.oneOf([VIEW_TYPE_LIST, VIEW_TYPE_GRID]).isRequired,
  intl         : intlShape.isRequired,
};
