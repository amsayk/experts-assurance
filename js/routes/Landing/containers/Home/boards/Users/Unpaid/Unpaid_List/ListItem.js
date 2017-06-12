import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';

import { compose, bindActionCreators } from 'redux';

import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import style from 'routes/Landing/styles';

import cx from 'classnames';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER, PATH_CASES_CASE } from 'vars';

import { injectIntl, intlShape } from 'react-intl';


class ListItem extends React.Component {
  constructor() {
    super();

    this.onItem = this.onItem.bind(this);
  }

  onItem() {
    this.props.onItem(this.props.item.id);
  }
  render() {
    const { intl, className, tabIndex, role, item } = this.props;
    const { id, refNo, company, client, manager, vehicle, validation, date, dateMission } = item;
    return (
      <div data-root-close-ignore role={role} tabIndex={tabIndex} className={cx(style.listItemWrapper, className)}>

        <div style={{}} className={style.listItemCompany}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <b>{company || '—'}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 115, minWidth: 115 }} className={style.listItemRef}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <Link to={PATH_CASES_CASE + '/' + id}>
                    <b>{refNo}</b>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 175, minWidth: 175 }} className={style.listItemClient}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + client.id}>
                    {client.displayName}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div style={{ maxWidth: 175, minWidth: 175 }} className={style.listItemManager}> */}
        {/*   <div className={style.wrapper}> */}
        {/*     <div className={style.innerWrapper}> */}
        {/*       <div className={style.item}> */}
        {/*         <div className={style.text}> */}
        {/*           {manager ? <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + manager.id}> */}
        {/*             {manager.displayName} */}
        {/*           </Link> : '—'} */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}

        <div className={style.listItemAgent}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {[vehicle.manufacturer, vehicle.model, vehicle.plateNumber].filter(e => e).join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className={style.listItemDate}> */}
          {/*   <div className={style.wrapper}> */}
            {/*     <div className={style.innerWrapper}> */}
              {/*       <div className={style.item}> */}
                {/*         <div className={style.text}> */}
                  {/*           {intl.formatDate(validation.date)} */}
                  {/*         </div> */}
                {/*       </div> */}
              {/*     </div> */}
            {/*   </div> */}
          {/* </div> */}

        <div className={style.listItemDate}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {intl.formatDate(dateMission)}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

ListItem.propTypes = {
  intl       : intlShape.isRequired,
  onItem     : T.func.isRequired,
  tabIndex   : T.string.isRequired,
  role       : T.string.isRequired,
  item       : T.shape({
    id          : T.string.isRequired,
    refNo       : T.string.isRequired,
    createdAt   : T.number.isRequired,
    updatedAt   : T.number.isRequired,
  }).isRequired,
};

export default compose(
  injectIntl,
)(ListItem);

