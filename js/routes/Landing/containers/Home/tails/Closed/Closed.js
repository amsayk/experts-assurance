import React from 'react'

import style from 'routes/Landing/styles';

import cx from 'classnames';

import {
  DoneIcon,
} from 'components/icons/MaterialIcons';

export default class Closed extends React.Component {
  render() {
    const { loading, info } = this.props;
    return (
      <div className={cx(style.tail, style.tailClosed)}>
        <div className={style.row}>
          <div className={style.tailTop}>
            <DoneIcon size={32}/>
          </div>
          <div className={style.tailBody}>
            <div className={style.h2}>
              {loading ? null : info.count || 0}
            </div>
            <div className={style.uppercase}>
              Clos
            </div>
          </div>
        </div>
      </div>
    )
  }
}

