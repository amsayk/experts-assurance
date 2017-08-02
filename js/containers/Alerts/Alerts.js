import React from 'react';
import T from 'prop-types';

import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from 'components/bootstrap/Button';

import { BellIcon, CloseIcon } from 'components/icons/MaterialIcons';

import style from './Alerts.scss';

import cx from 'classnames';

import Tooltip from 'components/react-components/Tooltip';
import Trigger from 'components/react-components/Trigger';

import { intlShape } from 'react-intl';

// import Zoom from 'components/transitions/Zoom';

const WIDTH = 300;

const tooltipAlign = {
  offset: [0, -4],
};

import selector from './selector';

function AlertsPopup({ onClose }) {
  return (
    <div className={style.popupAlerts} style={{ width: WIDTH }}>
      <div>
        <div className={style.popupAlertsHeader}>
          <span className={style.popupAlertsHeaderTitle}>Notifications</span>
          <Button
            onClick={onClose}
            className={style.popupAlertsHeaderCloseButton}
          >
            <CloseIcon size={18} />
          </Button>
        </div>
        <div>
          <div className={style.popupAlertsContent}>
            <p className={style.emptyList}>
              <span>Vous n'avez encore aucune notification</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

class Alerts extends React.Component {
  state = {
    open: false,
  };
  componentDidMount() {
    const self = this;
    setImmediate(function() {
      self.setState({
        open: self.props.alertsOpen,
      });
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      open: nextProps.alertsOpen,
    });
  }
  render() {
    const { number, isReady, scrolling, toggleAlerts } = this.props;

    // let count = (
    //   <span className={style.jewelCount}>
    //     <span className={style.number}>{number}</span>
    //   </span>
    // );

    let count = (
      <span className={cx(style.mailStatus, number > 0 && style.unread)} />
    );
    if (isReady) {
      // count = (
      //   <Zoom transitionAppear in>
      //     {count}
      //   </Zoom>
      // );
    }

    let content;
    if (this.state.open && scrolling.scrollTop === 0) {
      content = (
        <Trigger
          onPopupVisibleChange={toggleAlerts}
          destroyPopupOnHide
          hideAction={['click']}
          action={[]}
          popupVisible
          popupAlign={{
            points: ['tc', 'bc'],
            offset: [-66, 20],
          }}
          popup={() => <AlertsPopup onClose={toggleAlerts} />}
        >
          <div className={style.alertsWrapper}>
            <BellIcon.Empty size={36} />
            {count}
          </div>
        </Trigger>
      );
    } else {
      content = (
        <Tooltip
          align={tooltipAlign}
          placement='bottom'
          overlay={'Notifications'}
        >
          <div className={style.alertsWrapper}>
            <BellIcon.Empty size={36} />
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
  number: '+99',
};

Alerts.propTypes = {
  intl: intlShape.isRequired,
  toggleAlerts: T.func.isRequired,
  alertsOpen: T.bool.isRequired,
  number: T.number.isRequired,
};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch),
  };
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(Connect)(Alerts);
