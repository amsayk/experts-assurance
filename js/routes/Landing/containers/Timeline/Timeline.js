import React from 'react'
import { compose } from 'redux';

import { isServer } from 'vars';

import ScrollSpy from 'components/ScrollSpy';

import { injectIntl } from 'react-intl';

import withCurrentUser from 'utils/withCurrentUser';

import DataLoader from 'routes/Landing/DataLoader';

import TimelineEntry from './TimelineEntry';

import style from 'routes/Landing/styles';

const NAVBAR_HEIGHT = 70;

const isReady = true;

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
    const { intl, currentUser, loading, result : items } = this.props;

    if (loading) {
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

    return (
      <div className={style.timeline}>
        <h2>
          Activité récente
        </h2>
        <div className={style.feed}>
          {items.map((entry) => (
            <TimelineEntry
              key={entry.id}
              intl={intl}
              {...entry}
            />
          ))}
          {scrollSpy}
        </div>
      </div>
    )
  }
}

export default compose(
  injectIntl,
  withCurrentUser,
  DataLoader.timeline,
)(Timeline);

