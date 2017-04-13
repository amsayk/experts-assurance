import React, { PropTypes as T } from 'react';
import { compose } from 'redux';

import { Link } from 'react-router';

import style from 'routes/Search/styles';

import cx from 'classnames';

import { PATH_SETTINGS_BASE, PATH_SETTINGS_BUSINESS_USER, PATH_CASES_CASE } from 'vars';

import {
  CloseIcon,

  UnknownIcon,
  WatchIcon,
  DoneIcon,
  CanceledIcon,

  CheckboxIcon,
} from 'components/icons/MaterialIcons';

import { injectIntl, intlShape } from 'react-intl';

const STATE_ICON = {
  PENDING  : <UnknownIcon   className={style.stateIcon} size={24}/>,
  OPEN     : <WatchIcon     className={style.stateIcon} size={24}/>,
  CLOSED   : <DoneIcon      className={style.stateIcon} size={24}/>,
  CANCELED : <CanceledIcon  className={style.stateIcon} size={24}/>,
};

function StateIcon({ state, onClick }) {
  return (
    <div className={cx(style.icon, style.state, style[state])}>
      {STATE_ICON[state]}
    </div>
  );
}

class ListItem extends React.Component {
  constructor() {
    super();

    this.onItem = this.onItem.bind(this);
  }

  onItem() {
    this.props.onItem(this.props.item._source.id);
  }
  render() {
    const { intl, className, tabIndex, role, item } = this.props;
    const { id, refNo, state, client, manager, agent, vehicle, date } = item._source;
    return (
      <div data-root-close-ignore role={role} tabIndex={tabIndex} className={cx(style.listItemWrapper, className)}>

        <div className={style.listItemRef}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <StateIcon
                  state={state}
                  onClick={this.onItem}
                />
                <div className={style.text} style={{ marginLeft: 6 }}>
                  <Link to={PATH_CASES_CASE + '/' + id}>
                    #{refNo}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemClient}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + client.id}>
                    {client.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemManager}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {agent ? <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + agent.id}>
                    {agent.name}
                  </Link> : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemManager}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {manager ? <Link to={PATH_SETTINGS_BASE + '/' + PATH_SETTINGS_BUSINESS_USER + '/' + manager.id}>
                    {manager.name}
                  </Link> : '—'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemAgent}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {vehicle.model}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemVehicle}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {vehicle.plateNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemDate}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  {intl.formatDate(date)}
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
  }).isRequired,
};

export default compose(
  injectIntl,
)(ListItem);

