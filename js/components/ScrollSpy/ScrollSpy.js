import React, { PropTypes as T } from 'react';

import ActivityIndicator from 'components/ActivityIndicator';

import addEventListener from 'utils/lib/DOM/addEventListener';

import raf from 'requestAnimationFrame';

import style from './ScrollSpy.scss';

import cx from 'classnames';

class Spying extends React.Component {
  static propTypes = {
    offset            : T.number.isRequired,
    disabled          : T.bool.isRequired,
    onSpy             : T.func.isRequired,
    scrollThreshold   : T.number.isRequired,
    fetchMore         : T.bool.isRequired,
  }
  static defaultProps = {
    offset          : 0,
    disabled        : false,
    scrollThreshold : 0.8,
  }
  constructor(props) {
    super(props);

    this._handleScroll = this._handleScroll.bind(this);
  }
  _unregisterEventHandlers() {
    if (this._eventHandler) {
      this._eventHandler.remove();
      this._eventHandler = null;
    }

  }
  _registerEventHandlers() {
    this._eventHandler = addEventListener(window, 'scroll', this._handleScroll, /* capture = */ true);
  }
  componentDidMount() {
    if (!this.props.disabled) {
      this._registerEventHandlers();
    }
  }

  componentWillUnmount() {
    this._unregisterEventHandlers();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.disabled === true && nextProps.disabled === false) {
      this._registerEventHandlers();
    } else if (this.props.disabled === false && nextProps.disabled === true) {
      this._unregisterEventHandlers();
    }
  }
  _isAtBottom(target, scrollThreshold) {
    const clientHeight = (target === document.body || target === document.documentElement)
      ? window.screen.availHeight : target.clientHeight;

    const scrolled = scrollThreshold * (target.scrollHeight - target.scrollTop - this.props.offset);
    return scrolled < clientHeight;
  }
  _handleScroll(event) {
    if (this.props.fetchMore) {
      const target = event.target;
      const scrollThreshold = this.props.scrollThreshold;

      if (this._isAtBottom(target, scrollThreshold)) {
        raf(this.props.onSpy);
      }
    }

  }
  render() {
    const { fetchMore, disabled } = this.props;
    if (disabled) {
      return null;
    }

    return (
      <div className={cx(style.scrollSpy, !fetchMore && style.done)}>
        {fetchMore ? null : <div className={style.info}></div>}
      </div>
    );
  }
}

class Idle extends React.Component {
  static propTypes = {
    disabled : T.bool.isRequired,
  }
  static defaultProps = {
    disabled : false,
  }

  render() {
    const { disabled } = this.props;
    if (disabled) {
      return null;
    }

    return (
      <div className={style.scrollIdle}>
        <ActivityIndicator size='large'/>
      </div>
    );

  }
}

export default { Idle, Spying };

