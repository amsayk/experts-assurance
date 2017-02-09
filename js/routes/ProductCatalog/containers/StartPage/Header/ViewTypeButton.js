import React, { PropTypes as T } from 'react';

import Button from 'components/bootstrap/Button';

import { GridIcon, ListIcon } from 'components/icons/MaterialIcons';

import { intlShape } from 'react-intl';

import style from '../../../ProductCatalog.scss';

import Tooltip from 'components/react-components/Tooltip';

import {
  VIEW_TYPE_GRID,
  VIEW_TYPE_LIST,
} from 'redux/reducers/catalog/constants';

const align = {
  offset: [0, -4],
};

export default class ViewTypeButton extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.viewType !== nextProps.viewType;
  }
  render() {
    const { viewType, viewTypeList, viewTypeGrid } = this.props;
    let content;
    if (viewType === VIEW_TYPE_GRID) {
      content = (
        <Tooltip align={align} placement='bottom' overlay={'List view'}>
          <Button className={style.viewTypeBtn} onClick={viewTypeList}>
            <GridIcon size={24}/>
          </Button>
        </Tooltip>
      );
    } else {
      content = (
        <Tooltip align={align} placement='bottom' overlay={'Grid view'}>
          <Button className={style.viewTypeBtn} onClick={viewTypeGrid}>
            <ListIcon size={24}/>
          </Button>
        </Tooltip>
      );
    }
    return (
      <div className={style.viewType}>
        {content}
      </div>
    );
  }
}

ViewTypeButton.propTypes = {
  viewTypeList : T.func.isRequired,
  viewTypeGrid : T.func.isRequired,
  viewType     : T.oneOf([VIEW_TYPE_LIST, VIEW_TYPE_GRID]).isRequired,
  intl         : intlShape.isRequired,
};

ViewTypeButton.defaultProps = {
};

