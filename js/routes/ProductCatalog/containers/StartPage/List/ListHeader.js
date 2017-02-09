import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from '../../../ProductCatalog.scss';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

import {
  UpArrowIcon,
  DownArrowIcon,
} from 'components/icons/MaterialIcons';

import {
  SORT_DIRECTION_ASC,
  SORT_DIRECTION_DESC,
} from 'redux/reducers/sorting/constants';

import {
  sortProducts,
} from 'redux/reducers/catalog/actions';

const sortConfigSelector = (state) => state.getIn(['catalog', 'sortConfig']);

const selector = createSelector(
  sortConfigSelector,
  (sortConfig) => ({ sortConfig }),
);

function SortDirection({ direction }) {
  if (direction) {
    return (
      <div className={style.sortDirection}>
        {direction === SORT_DIRECTION_ASC ? <UpArrowIcon size={18}/> : <DownArrowIcon size={18}/>}
      </div>
    );
  }

  return null;
}

class ListHeader extends React.Component {
  constructor(props) {
    super(props);

    this.onSortByName = this.onSort.bind(this, 'displayName');
    this.onSortByDate = this.onSort.bind(this, 'date');
  }
  onSort(key) {
    const { actions, sortConfig } = this.props;
    const { direction } = sortConfig;

    actions.sortProducts(
      key, direction === SORT_DIRECTION_DESC ? SORT_DIRECTION_ASC : SORT_DIRECTION_DESC);
  }

  render() {
    const { sortConfig } = this.props;
    const { key, direction } = sortConfig;
    return (
      <div className={style.listHeader}>
        <div onClick={this.onSortByName} className={style.listHeaderItemName}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text, { [style.sorting]: key === 'displayName' })}>Name</div>
                {key === 'displayName' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>
        <div className={style.listHeaderItemBrandName}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>Brand name</div>
              </div>
            </div>
          </div>
        </div>
        <div onClick={this.onSortByDate} className={style.listHeaderItemDate}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text, { [style.sorting]: key === 'date' })}>Last modified</div>
                {key === 'date' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListHeader.propTypes = {
  intl: intlShape.isRequired,
  sortConfig: T.shape({
    key       : T.oneOf(['displayName', 'date']),
    direction : T.oneOf([SORT_DIRECTION_ASC, SORT_DIRECTION_DESC]),
  }).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      sortProducts,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(ListHeader);

