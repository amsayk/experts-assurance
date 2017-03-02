import React, { PropTypes as T } from 'react';

import Clients from './Clients';
import Users from './Users';

export default function Body (props) {
  return props.user.isAdminOrAgent
    ? <Users {...props}/>
    : <Clients {...props}/>;
}

Body.displayName = 'CasesBody';

Body.propTypes = {
  user : T.object.isRequired,
};

