import React from 'react'

import { compose } from 'redux';
import { connect } from 'react-redux';

import emptyObject from 'emptyObject';

import { SERVER } from 'vars';

import ScrollSpy from 'components/ScrollSpy';

import { injectIntl } from 'react-intl';

import withCurrentUser from 'utils/withCurrentUser';

import DataLoader from 'routes/Landing/DataLoader';

import selector from './selector';

import Nav from 'routes/Landing/components/Nav';

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
  static defaultProps = {
    cursor  : 0,
    loading : false,
    result  : [],
  };

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

      setTimeout(() => {
        this.setState({
          spy: true,
        });
      }, 7 * 1000);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (/*this.props.cursor !== nextProps.cursor && */nextProps.loading === false) {
      this.setState({
        spy : true,
      });
    }
  }
  render() {
    const {
      intl,
      notificationOpen,
      timelineDisplayMatches,
      isReady,
      currentUser,
      loading,
      cursor,
      result : items,
      extrapolation : periods,
      id,
    } = this.props;

    if (/*loading || */(!timelineDisplayMatches && !id)) {
      return null;
    }

    let scrollSpy = null;
    if (isReady && !SERVER) {
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
      const acts = items.filter(({ now }) => to
        ? to > now && now >= from
        : now >= from
      );

      acts.sort((a, b) => b.timestamp - a.timestamp);

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
        {this.props.onNav ? <Nav
          intl={intl}
          onChange={this.props.onNav}
          selectedNavItem='timeline.events'
        /> : <h2>Événements
        </h2>}
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

