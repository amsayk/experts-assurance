import { defineMessages } from 'react-intl';

export default defineMessages({
  InvalidLink: {
    id: 'notifications.invalid_link',
    defaultMessage: 'Invalid Link',
  },

  PasswordResetSuccess: {
    id: 'notifications.password_reset_success',
    defaultMessage: 'Successfully updated your password!',
  },

  EmailVerificationSuccess: {
    id: 'notifications.email_verification_success',
    defaultMessage: 'Successfully verified your email!',
  },

  EmailVerificationPending: {
    id: 'notifications.email_verification_pending',
    defaultMessage: 'Please activate your account. We sent an email to {email}. {resendEmailVerificationLink} {changeEmail}',
  },

  ResendVerification: {
    id: 'notifications.resend_verification',
    defaultMessage: 'Resend activation',
  },
  ChangeEmail: {
    id: 'notifications.change_email',
    defaultMessage: 'Change your email address',
  },
});

