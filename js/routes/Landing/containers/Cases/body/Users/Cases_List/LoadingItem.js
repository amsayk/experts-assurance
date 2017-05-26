import React, { PropTypes as T } from 'react';

import style from 'routes/Landing/styles';

import cx from 'classnames';

function StateIcon() {
  return (
    <div
      className={style.placeholder}
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        marginRight: 25,
      }}
    >
    </div>
  );
}

const SIZE = 115;

export default class LoadingItem extends React.Component {

  render() {
    const { className, tabIndex, role } = this.props;
    return (
      <div data-root-close-ignore role={role} tabIndex={tabIndex} className={cx(style.listItemWrapper, className, style.loadingItem)}>

        <div className={style.listItemRef}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                {/* <StateIcon */}
                {/* /> */}
                <div className={style.text}>
                  <div
                    className={style.placeholder}
                    style={{ width : 75 }}
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemClient}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div
                    className={style.placeholder}
                    style={{ width: SIZE }}
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemManager}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div
                    className={style.placeholder}
                    style={{ width: SIZE }}
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.listItemAgent}>
          <div className={style.wrapper}>
            <div className={style.innerWrapper}>
              <div className={style.item}>
                <div className={style.text}>
                  <div
                    className={style.placeholder}
                    style={{ width: SIZE }}
                  >
                  </div>
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
                  <div
                    className={style.placeholder}
                    style={{ width: SIZE }}
                  >
                  </div>
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
                  <div
                    className={style.placeholder}
                    style={{ width: SIZE }}
                  >
                  </div>
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
  tabIndex   : T.string.isRequired,
  role       : T.string.isRequired,
};
