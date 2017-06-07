import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'routes/Landing/styles';

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
  sortCases,
} from 'redux/reducers/cases/actions';

const sortConfigSelector = (state) => state.getIn(['cases', 'sortConfig']);

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

    this.onSortByRef = this.onSort.bind(this, 'refNo');
    this.onSortByDate = this.onSort.bind(this, 'date');
  }
  onSort(key) {
    const { actions, sortConfig } = this.props;
    const { direction } = sortConfig;

    actions.sortCases(
      key, !direction || direction === SORT_DIRECTION_DESC ? SORT_DIRECTION_ASC : SORT_DIRECTION_DESC);
  }

  render() {
    const { sortConfig } = this.props;
    const { key, direction } = sortConfig;
    return (
      <div className={style.listHeader}>
        <div onClick={this.onSortByRef} className={cx(style.listHeaderItemRef, key === 'refNo' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>Réf</div>
                {key === 'refNo' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>

        <div className={style.listHeaderItemClient}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>Assuré</div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listHeaderItemManager}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>
                  Agent
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listHeaderItemVehicle}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>
                  Modèle
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listHeaderItemVehicle}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  Immatriculation
                </div>
              </div>
            </div>
          </div>
        </div>

        <div onClick={this.onSortByDate} className={cx(style.listHeaderItemDate, key === 'date' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>DT Sinistre</div>
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
    key       : T.oneOf(['refNo', 'date']),
    direction : T.oneOf([SORT_DIRECTION_ASC, SORT_DIRECTION_DESC]),
  }).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      sortCases,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(ListHeader);

