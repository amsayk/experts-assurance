import React from 'react';
import T from 'prop-types';

import Users from './Users';

export default function Body(props) {
  return <Users {...props} />;
}

Body.displayName = 'CasesBody';

Body.propTypes = {
  user: T.object.isRequired,
};
