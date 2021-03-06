import React from 'react';
import T from 'prop-types';

import style from 'routes/Landing/styles';

import cx from 'classnames';

const SIZE = 140;

export default class LoadingItem extends React.Component {
  render() {
    const { className, tabIndex, role } = this.props;
    return (
      <div
        data-root-close-ignore
        role={role}
        tabIndex={tabIndex}
        className={cx(style.listItemWrapper, className, style.loadingItem)}
      >
        <div
          style={{
            maxWidth: 115,
            minWidth: 115,
          }}
          className={style.listItemRef}
        >
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div className={style.placeholder} style={{ width: 32 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 140,
            minWidth: 140,
          }}
          className={style.listItemClient}
        >
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div className={style.placeholder} style={{ width: SIZE }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: 140,
            minWidth: 140,
          }}
          className={style.listItemManager}
        >
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div className={style.placeholder} style={{ width: SIZE }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemVehicle}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div className={style.placeholder} style={{ width: SIZE }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemDate}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div className={style.placeholder} style={{ width: SIZE }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemDate}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div className={style.placeholder} style={{ width: SIZE }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoadingItem.propTypes = {
  tabIndex: T.string.isRequired,
  role: T.string.isRequired,
};
