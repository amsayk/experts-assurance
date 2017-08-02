import React from 'react';
import T from 'prop-types';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { injectIntl, intlShape } from 'react-intl';

import { UpArrowIcon, DownArrowIcon } from 'components/icons/MaterialIcons';

import {
  SORT_DIRECTION_ASC,
  SORT_DIRECTION_DESC,
} from 'redux/reducers/sorting/constants';

import { sortInvalid } from 'redux/reducers/dashboard/actions';

const dashboardSelector = state => state.getIn(['dashboard']);

const selector = createSelector(dashboardSelector, dashboard => ({
  sortConfig: dashboard.invalid.sortConfig,
}));

function SortDirection({ direction }) {
  // if (direction) {
  return (
    <div className={style.sortDirection}>
      {direction === SORT_DIRECTION_ASC
        ? <UpArrowIcon size={18} />
        : <DownArrowIcon size={18} />}
    </div>
  );
  // }
  //
  // return null;
}

class ListHeader extends React.Component {
  constructor(props) {
    super(props);

    this.onSortByRef = this.onSort.bind(this, 'refNo');
    this.onSortByDate = this.onSort.bind(this, 'dateMission');
    this.onSortByValidationDate = this.onSort.bind(this, 'validation_date');
    this.onSortByCompany = this.onSort.bind(this, 'company');
  }
  onSort(key) {
    const { actions, sortConfig } = this.props;
    const { direction } = sortConfig;

    actions.sort(
      key,
      !direction || direction === SORT_DIRECTION_DESC
        ? SORT_DIRECTION_ASC
        : SORT_DIRECTION_DESC,
    );
  }

  render() {
    const { sortConfig } = this.props;
    const { key, direction } = sortConfig;
    return (
      <div style={{ position: 'sticky' }} className={style.listHeader}>
        <div
          style={{}}
          onClick={this.onSortByCompany}
          className={cx(
            style.listHeaderItemCompany,
            key === 'company' && style.sorting,
          )}
        >
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>Comp.</div>
                {key === 'company'
                  ? <SortDirection direction={direction} />
                  : null}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ maxWidth: 115, minWidth: 115 }}
          onClick={this.onSortByRef}
          className={cx(
            style.listHeaderItemRef,
            key === 'refNo' && style.sorting,
          )}
        >
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>Réf</div>
                {key === 'refNo'
                  ? <SortDirection direction={direction} />
                  : null}
              </div>
            </div>
          </div>
        </div>

        <div style={{}} className={style.listHeaderItemClient}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>Assuré</div>
              </div>
            </div>
          </div>
        </div>

        {/* <div style={{ maxWidth: 175, minWidth: 175 }} className={style.listHeaderItemManager}> */}
        {/*   <div className={style.wrapper}> */}
        {/*     <div className={style.innerWrapper}> */}
        {/*       <div className={style.item}> */}
        {/*         <div className={cx(style.text)}> */}
        {/*           Gestionaire */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}

        <div className={style.listHeaderItemManager}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>Véhicule</div>
              </div>
            </div>
          </div>
        </div>

        {/* <div onClick={this.onSortByValidationDate} className={cx(style.listHeaderItemDate, key === 'validation_date' && style.sorting)}> */}
        {/*   <div className={style.wrapper}> */}
        {/*     <div className={style.innerWrapper}> */}
        {/*       <div className={style.item}> */}
        {/*         <div className={style.text}>DT Validation</div> */}
        {/*         {key === 'validation_date' ? <SortDirection direction={direction}/> : null} */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}

        <div
          onClick={this.onSortByDate}
          className={cx(
            style.listHeaderItemDate,
            key === 'dateMission' && style.sorting,
          )}
        >
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>DT Mission</div>
                {key === 'dateMission'
                  ? <SortDirection direction={direction} />
                  : null}
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
    key: T.oneOf(['refNo', 'validation_date', 'dateMission']),
    direction: T.oneOf([SORT_DIRECTION_ASC, SORT_DIRECTION_DESC]),
  }).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        sort: sortInvalid,
      },
      dispatch,
    ),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(injectIntl, Connect)(ListHeader);
