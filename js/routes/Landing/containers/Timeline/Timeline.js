import React from 'react'

import { compose } from 'redux';
import { connect } from 'react-redux';

import emptyObject from 'emptyObject';

import { isServer } from 'vars';

import ScrollSpy from 'components/ScrollSpy';

import { injectIntl } from 'react-intl';

import withCurrentUser from 'utils/withCurrentUser';

import DataLoader from 'routes/Landing/DataLoader';

import selector from './selector';

import TimelineEntry from './TimelineEntry';

import style from 'routes/Landing/styles';

const NAVBAR_HEIGHT = 70;
const TOOLBAR_HEIGHT = 41;

const TOP = NAVBAR_HEIGHT + TOOLBAR_HEIGHT + 20;

const NOTIFICATION_HEIGHT = 45;

const styles = {
  notificationOpen : {
    top : TOP + NOTIFICATION_HEIGHT,
  },
};

class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.onSpy = this.onSpy.bind(this);

    this.state = {
      spy : !props.loading,
    };
  }

  onSpy() {
    this.setState({
      spy : false,
    }, () => {
      this.props.loadMore();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cursor !== nextProps.cursor && nextProps.loading === false) {
      this.setState({
        spy : true,
      });
    }
  }
  render() {
    const { intl, notificationOpen, timelineDisplayMatches, isReady, currentUser, loading, result : items, extrapolation : periods } = this.props;

    if (loading || !timelineDisplayMatches) {
      return null;
    }

    let scrollSpy = null;
    if (isReady && !isServer) {
      const { spy } = this.state;
      scrollSpy = (
        spy ? <ScrollSpy.Spying
          bubbles
          manual
          offset={NAVBAR_HEIGHT}
          onSpy={this.onSpy}
        /> : <ScrollSpy.Idle/>
      );
    }

    const groups = periods.map(({ id, title, to, from }) => {
      const acts = items.filter((item) => to
        ? to > item.timestamp && item.timestamp >= from
        : item.timestamp >= from
      );

      return acts.length ? (
        <div className={style.feedGroup} key={id}>
          <h5 className={style.feedGroupTitle}>{title}</h5>
          <section className={style.feedGroupItems}>
            {acts.map((entry) => (
              <TimelineEntry
                key={entry.id}
                intl={intl}
                {...entry}
              />
            ))}
          </section>
        </div>
      ) : <div className={style.feedGroup} key={id}></div>;
    });

    return (
      <div className={style.timeline} style={notificationOpen ? styles.notificationOpen : emptyObject}>
        <h2>Activité récente
        </h2>
        <div className={style.feed}>
          {groups}
          {scrollSpy}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(
  injectIntl,
  withCurrentUser,
  Connect,
  DataLoader.timeline,
)(Timeline);
