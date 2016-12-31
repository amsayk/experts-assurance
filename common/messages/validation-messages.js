import { defineMessages } from 'react-intl';

export default defineMessages({
  passwordRequired: {
    id: 'validation-messages.password-required',
    defaultMessage: 'Password required.',
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
    defaultMessage: 'Email required.',
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

  fullNameRequired: {
    id: 'validation-messages.fullname',
    defaultMessage: 'Full name required.',
  },

  businessNameRequired: {
    id: 'validation-messages.business-name',
    defaultMessage: 'Please enter your business\'s name.',
  },
  currentPassword: {
    id: 'validation-messages.current-password-error',
    defaultMessage: 'You entered an invalid password.',
  },
  currentPasswordRequired: {
    id: 'validation-messages.current-password-required-error',
    defaultMessage: 'Please enter your current password.',
  },

  passwordMinScore: {
    id: 'validation-messages.password-min-score',
    defaultMessage: 'Please choose a stronger password.',
  },
  newPasswordRequired: {
    id: 'validation-messages.new-password-required',
    defaultMessage: 'Please enter your new password.',
  },

});

