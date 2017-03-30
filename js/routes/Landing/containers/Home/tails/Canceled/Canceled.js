import React from 'react'

import style from 'routes/Landing/styles';

import cx from 'classnames';

import {
  CanceledIcon,
} from 'components/icons/MaterialIcons';

export default class Canceled extends React.Component {
  render() {
    const { loading, info } = this.props;
    return (
      <div className={cx(style.tail, style.tailCanceled)}>
        <div className={style.row}>
          <div className={style.tailTop}>
            <CanceledIcon size={32}/>
          </div>
          <div className={style.tailBody}>
            <div className={style.h2}>
              {loading ? null : info.count || 0}
            </div>
            <div className={style.uppercase}>
              Annulés
            </div>
          </div>
        </div>
      </div>
    )
  }
}

