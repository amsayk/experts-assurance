import React, { PropTypes as T } from 'react';

function loadAdvancedSearch(onLoad) {
  require.ensure([], (require) => {
    const { default : Component } = require('./AdvancedSearch');
    onLoad(Component);
  }, 'AdvancedSearch');
}

class Loader extends React.PureComponent{
  static propTypes = {
    children: T.func.isRequired,
  };
  static defaultProps = {
    children: (Component, props) => <Component {...props}/>
  }
  state = {
    Component: null,
  }
  componentWillMount(){
    const self = this;
    this.props.load(function (Component) {
      self.setState({ Component });
    })
  }
  render(){
    const { Component } = this.state;
    return Component ? this.props.children(Component, this.props) : null;
  }
}

export default function AdvancedSearch(props) {
  return (
    <Loader load={loadAdvancedSearch} {...props}/>
  );
}

