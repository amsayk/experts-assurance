import React from 'react'

import style from 'routes/Landing/styles';

import cx from 'classnames';

import {
  WatchIcon,
} from 'components/icons/MaterialIcons';

export default class Open extends React.Component {
  render() {
    const { loading, info } = this.props;
    return (
      <div className={cx(style.tail, style.tailOpen)}>
        <div className={style.row}>
          <div className={style.tailTop}>
            <WatchIcon size={32}/>
          </div>
          <div className={style.tailBody}>
            <div className={style.h2}>
              {loading ? null : info.count || 0}
            </div>
            <div className={style.uppercase}>
              En cours
            </div>
          </div>
        </div>
      </div>
    )
  }
}

