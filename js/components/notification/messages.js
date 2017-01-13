import { defineMessages } from 'react-intl';

export default defineMessages({
  InvalidLink: {
    id: 'notification.invalid_link',
    defaultMessage: 'This link has expired. Please restart the process. Thank you.',
  },

  PasswordResetSuccess: {
    id: 'notification.password_reset_success',
    defaultMessage: 'Your password was updated!',
  },

  EmailVerificationSuccess: {
    id: 'notification.email_verification_success',
    defaultMessage: 'Success. Thank you for verifying your email!',
  },

  EmailVerificationPending: {
    id: 'notification.email_verification_pending',
    defaultMessage: 'Please activate your account. We sent an email to {email}. {resendEmailVerificationLink} {changeEmail}',
  },

  ResendVerification: {
    id: 'notification.resend_verification',
    defaultMessage: 'Resend activation',
  },
  ChangeEmail: {
    id: 'notification.change_email',
    defaultMessage: 'Change your email address',
  },

  emailSent: {
    id: 'notification.email-sent-successfully',
    defaultMessage: 'Thank you. We sent an email to the provided address.',
  },

  BusinessRequired: {
    id: 'notification.business-required',
    defaultMessage: 'Thank you for using {appName}. The next step is to add your business details. Please {link} to get started.',
  },
  AddBusinessLink: {
    id: 'notification.add-business-link',
    defaultMessage: 'click here',
  },

  SessionExpired: {
    id: 'notification.session-expired',
    defaultMessage: 'Your session expired. Please login again.',
  },
});


