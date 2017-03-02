import React, { PropTypes as T } from 'react';

import ActivityIndicator from 'components/ActivityIndicator';

import addEventListener from 'utils/lib/DOM/addEventListener';

import Button from 'components/bootstrap/Button';

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
      this._eventHandler = addEventListener(document, 'scroll', this._handleScroll, /* capture = */ !this.props.bubbles);
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
      return ((this.props.scrollThreshold * document.body.scrollHeight) <= document.body.scrollTop + window.innerHeight + this.props.offset);
    } else {
      const target = event.target;
      const clientHeight = (target === document.body || target === document.documentElement)
        ? window.screen.availHeight : target.clientHeight;

      const scrolled = this.props.scrollThreshold * (target.scrollHeight - target.scrollTop - this.props.offset);
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
    return this.props.manual ? (
      <Button bsStyle='secondary' onClick={this._onMore} role='button'>
        Plus d'activité
      </Button>
    ) : null;
  }
  render() {
    const { fetchMore, disabled } = this.props;
    if (disabled) {
      return null;
    }

    return (
      <div className={cx(style.scrollSpy, !fetchMore && style.done)}>
        {fetchMore
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
    const { disabled, Loading } = this.props;
    if (disabled) {
      return null;
    }

    return (
      <Loading/>
    );

  }
}

export default { Idle, Spying };

