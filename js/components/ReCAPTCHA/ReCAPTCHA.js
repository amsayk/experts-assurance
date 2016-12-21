import React, { PropTypes as T } from 'react';
import Recaptcha from 'react-recaptcha';
import nullthrows from 'nullthrows';
import loadScript from 'loadScript';

import { RECAPCHA_JS_URL, RECAPCHA_SITE_KEY  } from 'vars';

export default class ReCAPTCHA extends React.Component {
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
    this.onVerify       = this.onChange.bind(this, true);
    this.onExpired      = this.onChange.bind(this, false);
  }
  componentWillMount() {
    if (!this.state.loaded) {
      loadScript(nullthrows(RECAPCHA_JS_URL)).then(() => this.setState({
        loaded: true,
      }));
    }
  }
  onLoadCallback() {
  }
  onChange(value) {
    this.props.input.onChange(value);
  }
  render() {
    if (this.state.loaded) {
      return (
        <Recaptcha
          sitekey={nullthrows(RECAPCHA_SITE_KEY)}
          render={'explicit'}
          verifyCallback={this.onVerify}
          onloadCallback={this.onLoadCallback}
          expiredCallback={this.onExpired}
        />
      );
    }
    return null;
  }
}

