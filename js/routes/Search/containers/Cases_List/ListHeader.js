import React, { PropTypes as T } from 'react';
import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'routes/Search/styles';

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
  sortDocs,
} from 'redux/reducers/docSearch/actions';

const sortConfigSelector = (state) => state.getIn(['docSearch', 'sortConfig'], {});

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

    this.onSortByRef            = this.onSort.bind(this, 'refNo');
    this.onSortByClient         = this.onSort.bind(this, 'client.name');
    this.onSortByAgent          = this.onSort.bind(this, 'agent.name');
    this.onSortByManager        = this.onSort.bind(this, 'manager.name');
    this.onSortByManufacturer   = this.onSort.bind(this, 'vehicle.manufacturer');
    this.onSortByModel          = this.onSort.bind(this, 'vehicle.model');
    this.onSortByPlateNumber    = this.onSort.bind(this, 'vehicle.plateNumber');
    this.onSortByDate           = this.onSort.bind(this, 'dateMission');
    this.onSortByCompany        = this.onSort.bind(this, 'company');
  }
  onSort(key) {
    const { actions, sortConfig } = this.props;
    const { direction } = sortConfig;

    actions.sort(
      key, !direction || direction === SORT_DIRECTION_DESC ? SORT_DIRECTION_ASC : SORT_DIRECTION_DESC);
  }

  render() {
    const { sortConfig } = this.props;
    const { key, direction } = sortConfig;
    return (
      <div className={style.listHeader}>

        <div style={{}} onClick={this.onSortByCompany} className={cx(style.listHeaderItemCompany, key === 'company' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>Comp.</div>
                {key === 'company' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>

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

        <div onClick={this.onSortByClient} className={cx(style.listHeaderItemClient, key === 'client.name' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>Assuré</div>
                {key === 'client.name' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>

        <div onClick={this.onSortByAgent} className={cx(style.listHeaderItemAgent, key === 'agent.name' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>
                  Agent
                </div>
                {key === 'agent.name' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>

        {/* <div onClick={this.onSortByManager} className={cx(style.listHeaderItemManager, key === 'manager.name' && style.sorting)}> */}
        {/*   <div className={style.wrapper}> */}
        {/*     <div className={style.innerWrapper}> */}
        {/*       <div className={style.item}> */}
        {/*         <div className={cx(style.text)}> */}
        {/*           Gestionnaire */}
        {/*         </div> */}
        {/*         {key === 'manager.name' ? <SortDirection direction={direction}/> : null} */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}

        <div onClick={this.onSortByManufacturer} className={cx(style.listHeaderItemVehicle, key === 'vehicle.manufacturer' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>
                  Fabricant
                </div>
                {key === 'vehicle.manufacturer' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>

        <div onClick={this.onSortByModel} className={cx(style.listHeaderItemVehicle, key === 'vehicle.model' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={cx(style.text)}>
                  Modèle
                </div>
                {key === 'vehicle.model' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>

        <div onClick={this.onSortByPlateNumber} className={cx(style.listHeaderItemVehicle, key === 'vehicle.plateNumber' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  Immatriculation
                </div>
                {key === 'vehicle.plateNumber' ? <SortDirection direction={direction}/> : null}
              </div>
            </div>
          </div>
        </div>

        <div onClick={this.onSortByDate} className={cx(style.listHeaderItemDate, key === 'dateMission' && style.sorting)}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>DT Mission</div>
                {key === 'dateMission' ? <SortDirection direction={direction}/> : null}
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
    key       : T.oneOf([
      'refNo',
      'dateMission',
    ]),
    direction : T.oneOf([SORT_DIRECTION_ASC, SORT_DIRECTION_DESC]),
  }).isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      sort : sortDocs,
    }, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect,
)(ListHeader);

