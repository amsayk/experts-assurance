import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from '../../../ProductCatalog.scss';

import messages from '../../../messages';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

import Dropdown from 'components/bootstrap/Dropdown';
import MenuItem from 'components/bootstrap/MenuItem';
import Button from 'components/bootstrap/Button';

import {
  UpArrowIcon,
  DownArrowIcon,
} from 'components/icons/MaterialIcons';

import {
  SORT_DIRECTION_ASC,
  SORT_DIRECTION_DESC,
} from 'redux/reducers/sorting/constants';

import {
  sortProductsByKey,
  sortProductsByDirection,
} from 'redux/reducers/catalog/actions';

const sortConfigSelector = (state) => state.getIn(['catalog', 'sortConfig']);

const selector = createSelector(
  sortConfigSelector,
  (sortConfig) => ({ sortConfig }),
);

function SortDirection({ direction, onSortByDirection }) {
  if (direction) {
    return (
      <Button onClick={onSortByDirection} className={style.sortDirection} role='button'>
        {direction === SORT_DIRECTION_ASC ? <UpArrowIcon size={18}/> : <DownArrowIcon size={18}/>}
      </Button>
    );
  }

  return null;
}

class GridHeader extends React.Component {
  constructor(props) {
    super(props);

    this.onSortByKey = this.onSortByKey.bind(this);
    this.onSortByDirection = this.onSortByDirection.bind(this);
  }
  onSortByKey(key) {
    const { actions } = this.props;
    actions.sortProductsByKey(
      key);
  }

  onSortByDirection() {
    const { actions, sortConfig } = this.props;
    const { direction } = sortConfig;

    actions.sortProductsByDirection(
      direction === SORT_DIRECTION_DESC ? SORT_DIRECTION_ASC : SORT_DIRECTION_DESC);
  }

  render() {
    const { intl, sortConfig } = this.props;
    const {
      key = 'date',
      direction = SORT_DIRECTION_DESC,
    } = sortConfig;
    return (
      <div className={style.gridHeader}>
        <div className={style.gridHeaderItem}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <Dropdown pullRight className={style.info} onSelect={this.onSortByKey}>
                  <Dropdown.Toggle className={style.sortButton}>
                    {intl.formatMessage(messages['sortKey_' + key])}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={style.sortMenu}>
                    <MenuItem
                      className={cx({ [style.sortKey]: key === 'displayName' })}
                      eventKey='displayName'
                    >
                      Name
                    </MenuItem>
                    <MenuItem
                      className={cx({ [style.sortKey]: key === 'date' })}
                      eventKey='date'
                    >
                      Last modified
                    </MenuItem>
                  </Dropdown.Menu>
                </Dropdown>
                <SortDirection onSortByDirection={this.onSortByDirection} direction={direction}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

GridHeader.propTypes = {
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
      sortProductsByKey,
      sortProductsByDirection,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(GridHeader);

