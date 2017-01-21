import React, { PropTypes as T } from 'react';
import objectAssign from 'object-assign';

const DEFAULT_ICON_SIZE = 12;

export default function createIconSet(glyphMap, fontFamily) {
  const IconNamePropType = T.oneOf(Object.keys(glyphMap));

  class Icon extends React.Component {
    static propTypes = {
      name  : IconNamePropType.isRequired,
      size  : T.number,
      color : T.string,
    };

    static defaultProps = {
      size: DEFAULT_ICON_SIZE,
      allowFontScaling: false,
    };

    root = null;
    handleRef = (ref) => {
      this.root = ref;
    };

    render() {
      const { name, size, color, style, ...props } = this.props;

      let glyph = glyphMap[name] || '?';
      if (typeof glyph === 'number') {
        glyph = String.fromCharCode(glyph);
      }

      const styleDefaults = {
        fontSize: size,
        color,
      };

      const styleOverrides = {
        fontFamily,
        fontWeight: 'normal',
        fontStyle: 'normal',
      };

      props.style = objectAssign({}, styleDefaults, style, styleOverrides);
      props.ref = this.handleRef;

      return (
        <span {...props}>
          {glyph}{this.props.children}
        </span>
      );
    }
  }

  return Icon;
}

