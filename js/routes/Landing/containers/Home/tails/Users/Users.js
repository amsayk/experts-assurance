import React, { PropTypes as T } from 'react';
import { compose } from 'redux';

import DataLoader from 'routes/Landing/DataLoader';

import style from 'routes/Landing/styles';

// import Pending from '../Pending';
import Open from '../Open';
import Closed from '../Closed';
import Canceled from '../Canceled';

function Users({ loading, info }) {
  return (
    <div className={style.tails}>
      {/* <Pending */}
      {/*   loading={loading} */}
      {/*   info={info.pending} */}
      {/* /> */}
      <Open
        loading={loading}
        info={info.open}
      />
      <Closed
        loading={loading}
        info={info.closed}
      />
      <Canceled
        loading={loading}
        info={info.canceled}
      />
    </div>
  );
}

Users.defaultProps = {
  loading: false,
  info: {
    // pending: { count: null },
    open: { count: null },
    closed: { count: null },
    canceled: { count: null },
  },
}

export default compose(
  DataLoader.dashboard,
)(
  Users
)

