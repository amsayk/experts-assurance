import { defineMessages } from 'react-intl';

export default defineMessages({
  logOut: {
    id: 'activation-page.logOut',
    defaultMessage: 'Déconnexion',
  },

  Thanks: {
    id: 'activation.thanks',
    defaultMessage: `
      Merci d'utiliser {appName}.
    `,
  },
  EmailVerificationPending: {
    id: 'activation.email_verification_pending',
    defaultMessage: `
      Vous devez valider votre adresse e-mail avant de continue. Nous avons envoyé un e-mail à {email}.
    `,
  },
  Actions: {
    id: 'activation.actions',
    defaultMessage: `
      Si vous n'avez pas reçu d'e-mail, {resendEmailVerificationLink} ou {changeEmail}.
    `,
  },

  ResendVerification: {
    id: 'activation.resend_verification',
    defaultMessage: 'Renvoyer l’e-mail de validation',
  },

  ChangeEmail: {
    id: 'activation.change_email',
    defaultMessage: 'Mettre à votre adresse e-mail',
  },

  emailSent: {
    id: 'activation.email-sent-successfully',
    defaultMessage: 'Merci. Nous avons envoyé un e-mail à l’adresse fournie.',
  },
});

