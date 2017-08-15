import React from 'react';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { createSelector } from 'utils/reselect';

import { SERVER } from 'vars';

class Index extends React.Component {
  static displayName = 'Importation:Index';

  constructor(props) {
    super(props);

    this.state = {
      Component: null,
    };
  }

  componentWillMount() {
    if (!SERVER) {
      require.ensure(
        [],
        require => {
          this.setState({
            Component: require('./Importation').default,
          });
        },
        'Importation',
      );
    }
  }

  render() {
    const { isReady, ...props } = this.props;

    if (isReady && this.state.Component) {
      return <this.state.Component {...props} />;
    }

    return null;
  }
}

const isReadySelector = state => {
  return state.getIn(['app', 'isReady']);
};

const selector = createSelector(isReadySelector, isReady => ({
  isReady,
}));

function mapStateToProps(state, props) {
  return selector(state, props);
}

const Connect = connect(mapStateToProps);

export default compose(Connect)(Index);
