import React from 'react';
import T from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import Recaptcha from 'react-recaptcha';
import nullthrows from 'nullthrows';
import loadScript from 'loadScript';
import debug from 'log';

const log = debug('app:client:recaptcha');

import { RECAPCHA_JS_URL, RECAPCHA_SITE_KEY } from 'vars';

class ReCAPTCHA extends React.Component {
  static propTypes = {
    input: T.shape({
      onChange: T.func.isRequired,
    }).isRequired,
  };
  state = {
    loaded: typeof grecaptcha !== 'undefined',
  };
  constructor(props) {
    super(props);

    this.onLoadCallback = this.onLoadCallback.bind(this);
    this.onVerify = this.onChange.bind(this, true);
    this.onExpired = this.onChange.bind(this, false);
  }
  async componentWillMount() {
    if (!this.state.loaded) {
      try {
        await loadScript(nullthrows(RECAPCHA_JS_URL));
        this.setState({
          loaded: true,
        });
      } catch (e) {
        log.error('Error loading recaptcha', e);
      }
    }
  }
  onLoadCallback() {}
  onChange(value) {
    this.props.input.onChange(value);
  }
  render() {
    if (this.props.isReady && this.state.loaded) {
      return (
        <Recaptcha
          sitekey={nullthrows(RECAPCHA_SITE_KEY)}
          render={'explicit'}
          size='invisible'
          verifyCallback={this.onVerify}
          onloadCallback={this.onLoadCallback}
          expiredCallback={this.onExpired}
        />
      );
    }
    return null;
  }
}

const isReadySelector = state => state.getIn(['app', 'isReady']);

const selector = createSelector(isReadySelector, isReady => ({ isReady }));

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(Connect)(ReCAPTCHA);
