import React, { PropTypes as T } from 'react'

import style from 'routes/Landing/styles';

const HEIGHT = '1.3em';

const WIDTHS = [ 125, 135, 155 ];

function genRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Loading extends React.Component {
  render() {
    const { width } = this.props;
    return (
      <div className={style.overviewLine}>
        <div className={style.overviewLabel}>
          <div
            className={style.placeholder}
            style={{ width: `${width * 0.8}ch`, height: HEIGHT }}
          >
          </div>
        </div>
        <div className={style.overviewValue}>
          <div
            className={style.placeholder}
            style={{ width: WIDTHS[genRandomNumber(0, WIDTHS.length - 1)], height: HEIGHT }}
          >
          </div>
        </div>
      </div>
    );
  }
}

Loading.propTypes = {
  width : T.number.isRequired,
};

