import merge from 'lodash.merge';
import lightBaseTheme from './baseThemes/lightBaseTheme';
import zIndex from './zIndex';
import callOnce from '../utils/callOnce';
import { compose } from 'redux';
import {
  red500,
  transparent,
} from './colors';

/**
 * Get the MUI theme corresponding to a base theme.
 * It's possible to override the computed theme values
 * by providing a second argument. The calculated
 * theme will be deeply merged with the second argument.
 */
export default function getMuiTheme(muiTheme, ...more) {
  muiTheme = merge({
    zIndex,
    isRtl: false,
    userAgent: undefined,
  }, lightBaseTheme, muiTheme, ...more);

  const {spacing, fontFamily, palette} = muiTheme;
  const baseTheme = {spacing, fontFamily, palette};

  muiTheme = merge({
    textField: {
      textColor: palette.textColor,
      hintColor: palette.disabledColor,
      floatingLabelColor: palette.disabledColor,
      disabledTextColor: palette.disabledColor,
      errorColor: red500,
      focusColor: palette.primary1Color,
      backgroundColor: 'transparent',
      borderColor: palette.borderColor,
    },
  }, muiTheme, {
    baseTheme, // To provide backward compatibility.
  });

  const transformers = [callOnce]
    .map((t) => t(muiTheme))
    .filter((t) => t);

  muiTheme.prepareStyles = compose(...transformers);

  return muiTheme;
}

