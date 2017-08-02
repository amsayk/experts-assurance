import React, { Component } from 'react';
import T from 'prop-types';

import objectAssign from 'object-assign';

import emptyObject from 'emptyObject';

const thumbDefaultBoxShadow = '0px 1px 3px rgba(0,0,0,0.5)';
const thumbFocusedBoxShadow = `${thumbDefaultBoxShadow}, 0 0 0 10px rgba(0,0,0,0.1)`;

export default class Switch extends Component {
  static displayName = 'Switch';

  static propTypes = {
    activeThumbColor: T.string,
    activeTrackColor: T.string,
    disabled: T.bool,
    onValueChange: T.func,
    thumbColor: T.string,
    trackColor: T.string,
    value: T.bool,
  };

  static defaultProps = {
    activeThumbColor: '#009688',
    activeTrackColor: '#A3D3CF',
    disabled: false,
    style: emptyObject,
    thumbColor: '#FAFAFA',
    trackColor: '#939393',
    value: false,
  };

  blur() {}

  focus() {}

  render() {
    const {
      activeThumbColor,
      activeTrackColor,
      disabled,
      onValueChange, // eslint-disable-line
      style,
      thumbColor,
      trackColor,
      value,
      // remove any iOS-only props
      onTintColor, // eslint-disable-line
      thumbTintColor, // eslint-disable-line
      tintColor, // eslint-disable-line
      ...other
    } = this.props;

    const { height: styleHeight, width: styleWidth } = style;
    const height = styleHeight || 20;
    const minWidth = height * 2;
    const width = styleWidth > minWidth ? styleWidth : minWidth;
    const trackBorderRadius = height * 0.5;
    const trackCurrentColor = value ? activeTrackColor : trackColor;
    const thumbCurrentColor = value ? activeThumbColor : thumbColor;
    const thumbHeight = height;
    const thumbWidth = thumbHeight;

    const rootStyle = {
      ...styles.root,
      ...style,
      height,
      width,
      ...(disabled ? styles.cursorDefault : {}),
    };

    const trackStyle = {
      ...styles.track,
      backgroundColor: trackCurrentColor,
      borderRadius: trackBorderRadius,
      ...(disabled ? styles.disabledTrack : {}),
    };

    const thumbStyle = {
      ...styles.thumb,
      backgroundColor: thumbCurrentColor,
      height: thumbHeight,
      width: thumbWidth,
      ...(disabled ? styles.disabledThumb : {}),
    };

    const nativeControl = React.createElement('input', {
      checked: value,
      disabled: disabled,
      onBlur: this._handleFocusState,
      onChange: this._handleChange,
      onFocus: this._handleFocusState,
      ref: this._setCheckboxRef,
      style: { ...styles.nativeControl, ...styles.cursorInherit },
      type: 'checkbox',
    });

    return (
      <div {...other} style={rootStyle}>
        <div style={trackStyle} />
        <div
          ref={this._setThumbRef}
          style={{
            ...thumbStyle,
            ...(value ? styles.thumbOn : {}),
            marginLeft: value ? thumbWidth * -1 : 0,
          }}
        />
        {nativeControl}
      </div>
    );
  }

  _handleChange = (event: Object) => {
    const { onValueChange } = this.props;
    onValueChange && onValueChange(event.nativeEvent.target.checked);
  };

  _handleFocusState = (event: Object) => {
    const isFocused = event.nativeEvent.type === 'focus';
    const boxShadow = isFocused ? thumbFocusedBoxShadow : thumbDefaultBoxShadow;
    this._thumb.style.boxShadow = boxShadow;
  };

  _setCheckboxRef = component => {
    this._checkbox = component;
  };

  _setThumbRef = component => {
    this._thumb = component;
  };
}

const absoluteFillObject = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

const styles = {
  root: {
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
  },
  cursorDefault: {
    cursor: 'default',
  },
  cursorInherit: {
    cursor: 'inherit',
  },
  track: {
    ...absoluteFillObject,
    height: '70%',
    margin: 'auto',
    transitionDuration: '0.1s',
    width: '90%',
  },
  disabledTrack: {
    backgroundColor: '#D5D5D5',
  },
  thumb: {
    ...absoluteFillObject,
    alignSelf: 'flex-start',
    borderRadius: '100%',
    boxShadow: thumbDefaultBoxShadow,
    left: '0%',
    transform: [{ translateZ: 0 }],
    transitionDuration: '0.1s',
  },
  thumbOn: {
    left: '100%',
  },
  disabledThumb: {
    backgroundColor: '#BDBDBD',
  },
  nativeControl: {
    ...absoluteFillObject,
    height: '100%',
    margin: 0,
    opacity: 0,
    padding: 0,
    width: '100%',
  },
};
