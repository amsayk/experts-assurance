import React, { PropTypes as T } from 'react';

import ActivityIndicator from 'components/ActivityIndicator';

import addEventListener from 'utils/lib/DOM/addEventListener';

import Button from 'components/bootstrap/Button';

import raf from 'utils/requestAnimationFrame';

import style from './ScrollSpy.scss';

import cx from 'classnames';

class Spying extends React.Component {
  static propTypes = {
    offset            : T.number.isRequired,
    disabled          : T.bool.isRequired,
    onSpy             : T.func.isRequired,
    scrollThreshold   : T.number.isRequired,
    fetchMore         : T.bool.isRequired,
    bubbles           : T.bool.isRequired,
    manual            : T.bool.isRequired,
  }
  static defaultProps = {
    offset          : 0,
    disabled        : false,
    scrollThreshold : 0.8,
    bubbles         : false,
    fetchMore       : false,
    manual          : false,
    loadMoreLabel   : 'Plus d\'événements',
  }
  constructor(props) {
    super(props);

    this._handleScroll = this._handleScroll.bind(this);
    this._onMore = this._onMore.bind(this);
  }
  _unregisterEventHandlers() {
    if (this._eventHandler) {
      this._eventHandler.remove();
      this._eventHandler = null;
    }

  }
  _registerEventHandlers() {
    if (!this.props.manual) {
      this._eventHandler = addEventListener(document, 'scroll', this._handleScroll, /* capture = */ !this.props.bubbles, /* passive = */ true);
    }
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
  _isAtBottom(event) {
    if (this.props.bubbles) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      return ((this.props.scrollThreshold * document.body.scrollHeight) <= scrollTop + window.innerHeight + this.props.offset);
    } else {
      const target = event.target;
      const clientHeight = (target === document.body || target === document.documentElement)
        ? window.screen.availHeight : target.clientHeight;

      const scrollTop = target === document.body
        ? window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        : target.scrollTop;
      const scrolled = this.props.scrollThreshold * (target.scrollHeight - scrollTop - this.props.offset);
      return scrolled < clientHeight;
    }
  }
  _handleScroll(event) {
    if (this.props.fetchMore && this._isAtBottom(event)) {
      raf(this.props.onSpy);
    }

  }
  _onMore() {
    raf(this.props.onSpy);
  }
  renderLoadMoreButton() {
    return (
      <Button bsStyle='secondary' onClick={this._onMore} role='button'>
        {this.props.loadMoreLabel}
      </Button>
    );
  }
  render() {
    const { fetchMore, disabled, manual } = this.props;
    if (disabled) {
      return null;
    }

    return (
      <div className={cx(style.scrollSpy, !fetchMore && style.done)}>
        {fetchMore && !manual
          ? null
          : this.renderLoadMoreButton()}
        </div>
    );
  }
}

class Idle extends React.Component {
  static propTypes = {
    disabled : T.bool.isRequired,
    Loading  : T.element.isRequired,
  }
  static defaultProps = {
    disabled : false,
    Loading  : () => (
      <div className={style.scrollIdle}>
        <ActivityIndicator size='large'/>
      </div>
    ),
  }

  render() {
    const { disabled, Loading, done, doneLabel } = this.props;
    if (disabled) {
      return null;
    }

    if (done) {
      return doneLabel ? (
        <div className={style.loaded}>
          {doneLabel}
        </div>
      ) : null;
    }

    return (
      <Loading/>
    );

  }
}

export default { Idle, Spying };

