import React from 'react';
import T from 'prop-types';

export default Component =>
  class WithCurrentUser extends React.Component {
    static displayName = `WithCurrentUser(${Component.displayName ||
      Component.name ||
      'Component'})`;
    static contextTypes = {
      currentUser: T.object.isRequired,
    };
    render() {
      return (
        <Component {...this.props} currentUser={this.context.currentUser} />
      );
    }
  };
