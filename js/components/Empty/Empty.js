import React from 'react'

import style from './Empty.scss';

import cx from 'classnames';

function FilesSolid({}) {
  return (
    <svg viewBox='0 0 100 100'>
      <path d='M75 13v67.98c0 3.153-1.793 6.02-4.944 6.02H24.228v8.118c0 2.696 2.186 4.882 4.882 4.882h54.41c2.697 0 4.48-2.186 4.48-4.882V13H75z'/>
      <path d='M11 0v79h58V0H11zm47.034 67H23v-6h35.034v6zm0-17H23v-6h35.034v6zm0-16H23v-6.213h35.034V34zm0-17H23v-6.098h35.034V17z'/>
    </svg>
  )
}

export default class Empty extends React.Component {
  render() {
    const { noIcon, className, message, description } = this.props;
    return (
      <div className={cx(className, style.center)}>

        {noIcon ? null  : <div className={style.icon}>
          <svg width={80} height={80} fill='#343445'>
            <FilesSolid/>
          </svg>
        </div>}

        <div className={style.title}>
          {message || 'Aucun données à afficher.'}
        </div>

        {description ? <div className={style.description}>
          {description}
        </div> : null}

      </div>
    )
  }
}

Empty.defaultProps = {
  noIcon : false,
};

