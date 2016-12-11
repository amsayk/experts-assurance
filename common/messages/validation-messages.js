import { defineMessages } from 'react-intl';

export default defineMessages({
  passwordRequired: {
    id: 'validation-messages.password-required',
    defaultMessage: 'Password required',
  },

  passwordMinLength: {
    id: 'validation-messages.password-min-length',
    defaultMessage: 'Password must have at least {minLength} characters.',
  },

  passwordMismatch: {
    id: 'validation-messages.password-mismatch',
    defaultMessage: 'Passwords don\'t match',
  },

  emailRequired: {
    id: 'validation-messages.email-required',
    defaultMessage: 'Email required',
  },

  emailInvalid: {
    id: 'validation-messages.email-invalid',
    defaultMessage: 'Please enter a valid email address.',
  },

  emailTaken: {
    id: 'validation-messages.email-taken',
    defaultMessage: 'This email is already in our system. Please login.',
  },

  recaptchaRequired: {
    id: 'validation-messages.recaptcha',
    defaultMessage: 'Please verify you\'re a human.',
  },

});




