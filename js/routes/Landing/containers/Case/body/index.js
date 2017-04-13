import React, { PropTypes as T } from 'react';

import Users from './Users';

export default function Body (props) {
  return (
    <Users {...props}/>
  );
}

Body.displayName = 'CasesBody';

Body.propTypes = {
  user : T.object.isRequired,
};

