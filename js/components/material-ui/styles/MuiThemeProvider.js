import React, { Component } from 'react';
import T from 'prop-types';
import getMuiTheme from './getMuiTheme';

class MuiThemeProvider extends Component {
  static propTypes = {
    children: T.element,
    muiTheme: T.object,
  };

  static childContextTypes = {
    muiTheme: T.object.isRequired,
  };

  getChildContext() {
    return {
      muiTheme: this.props.muiTheme || getMuiTheme(),
    };
  }

  render() {
    return this.props.children;
  }
}

export default MuiThemeProvider;
