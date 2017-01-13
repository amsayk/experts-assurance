import React, { PropTypes as T } from 'react';

import { connect } from 'react-redux';

import { compose } from 'redux';

import raf from 'requestAnimationFrame';

import messages from './messages';

import EventListener from 'EventListener';

import debounce from 'debounce';

import { intlShape, injectIntl } from 'react-intl';

import { resize } from 'redux/reducers/app/actions';

import selector from './selector';

import Title from 'components/Title';

import { HOME_TITLE, APP_NAME } from 'vars';

import style from 'styles/core.scss';

import Notification from 'components/Notification';

class CoreLayout extends React.PureComponent {
  static propTypes = {
    children       : T.element.isRequired,
    displayMatches : T.bool.isRequired,
    onLine         : T.bool.isRequired,
    intl           : intlShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.onResize = this.onResize.bind(this);
  }
  onResize() {
    this.props.actions.resize();
  }
  componentDidMount() {
    this._resizeEventListener = EventListener.listen(window, 'resize', this.onResize);
  }
  componentWillUnmount() {
    try {
      this._resizeEventListener.remove();
    } catch (e) {
    }
  }
  render() {
    const { intl, displayMatches, onLine, children } = this.props;
    let body = React.Children.only(children);
    if (!displayMatches) {
      body = (
        <div className={style.root}>
          <div className={style.center}>
            {intl.formatMessage(messages.UnsupportedDisplay)}
          </div>
        </div>
      );
    } else if (!onLine) {
      body = (
        <div className={style.root}>
          <div className={style.center}>
            {intl.formatMessage(messages.NavigatorOffline)}
          </div>
        </div>
      );
    }
    return (
      <div className={style.root}>
        <Title title={HOME_TITLE + ' · ' + APP_NAME}/>
        <Notification/>
        {body}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: {
    resize: debounce(() => raf(() => dispatch(resize()))),
  }};
}

const Connect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  injectIntl,
  Connect
)(CoreLayout);

