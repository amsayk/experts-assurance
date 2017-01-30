import React, { PropTypes as T } from 'react';

import Button from 'components/bootstrap/Button';

import SimpleLineIcon from 'components/icons/SimpleLineIcons';
import MaterialIcon from 'components/icons/MaterialIcons';

import style from './Alerts.scss';

import Tooltip from 'components/react-components/Tooltip';
import Trigger from 'components/react-components/Trigger';

import { intlShape } from 'react-intl';

import Zoom from 'components/transitions/Zoom';

const bellIcon = <SimpleLineIcon name={'bell'} size={24}/>;
const closeIcon = <MaterialIcon name={'close'} size={18}/>;

const WIDTH = 300;

const popupAlign = {
  points: ['tc', 'bc'],
  offset: [-55, 12],
};

const tooltipAlign = {
  points: ['tc', 'bc'],
  offset: [0, -4],
};

function AlertsPopup({ onClose }) {
  return (
    <div className={style.popupAlerts} style={{ width: WIDTH }}>
      <div>
        <div className={style.popupAlertsHeader}>
          <span className={style.popupAlertsHeaderTitle}>Notifications</span>
          <Button onClick={onClose} className={style.popupAlertsHeaderCloseButton}>
            {closeIcon}
          </Button>
        </div>
        <div>
          <div className={style.popupAlertsContent}>
            <p className={style.emptyList}>
              <span>You don’t have any notifications yet</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default class Alerts extends React.Component {
  render() {
    const { alertsOpen, number, toggleAlerts } = this.props;

    const count = (
      <Zoom transitionAppear in>
        <span className={style.jewelCount}>
          <span className={style.number}>{number}</span>
        </span>
      </Zoom>
    );

    let content;
    if (alertsOpen) {
      content = (
        <Trigger
          onPopupVisibleChange={toggleAlerts}
          destroyPopupOnHide
          hideAction={['click']}
          action={[]}
          popupVisible
          popupAlign={popupAlign}
          popup={() => <AlertsPopup onClose={toggleAlerts}/>}
        >
          <div className={style.alertsWrapper}>
            {bellIcon}
            {count}
          </div>
        </Trigger>
      );
    } else {
      content = (
        <Tooltip align={tooltipAlign} overlay={'Notifications'}>
          <div className={style.alertsWrapper}>
            {bellIcon}
            {count}
          </div>
        </Tooltip>
      );
    }
    return (
      <div className={style.alerts}>
        <Button className={style.alertsBtn} onClick={toggleAlerts}>
          {content}
        </Button>
      </div>
    );

  }

}

Alerts.defaultProps = {
  number : 2,
};

Alerts.propTypes = {
  intl         : intlShape.isRequired,
  toggleAlerts : T.func.isRequired,
  alertsOpen   : T.bool.isRequired,
  count        : T.number.isRequired,
};

