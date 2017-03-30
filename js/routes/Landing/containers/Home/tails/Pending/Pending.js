import React from 'react'

import style from 'routes/Landing/styles';

import cx from 'classnames';

import {
  UnknownIcon,
} from 'components/icons/MaterialIcons';

export default class Pending extends React.Component {
  render() {
    const { loading, info } = this.props;
    return (
      <div className={cx(style.tail, style.tailPending)}>
        <div className={style.row}>
          <div className={style.tailTop}>
            <UnknownIcon size={32}/>
          </div>
          <div className={style.tailBody}>
            <div className={style.h2}>
              {loading ? null : info.count || 0}
            </div>
            <div className={style.uppercase}>
              En attente
            </div>
          </div>
        </div>
      </div>
    )
  }
}

