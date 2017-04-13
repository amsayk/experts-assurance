import {
  defineMessages,
} from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'account.signup-page.title',
    defaultMessage: 'Inscription à {appName} · {appName}',
  },

  title: {
    id: 'account.signup-form.title',
    defaultMessage: 'S’inscrire à {appName}',
  },

  tagLine: {
    id: 'account.signup-form.tagline',
    defaultMessage: 'Expertise d\'assurance.',
  },

  displayName: {
    id: 'account.signup-form.label.displayName',
    defaultMessage: 'Nom complet',
  },

  email: {
    id: 'account.signup-form.label.email',
    defaultMessage: 'Adresse e-mail',
  },

  password: {
    id: 'account.signup-form.label.password',
    defaultMessage: 'Mot de passe',
  },

  error: {
    id: 'account.signup-form.login-error',
    defaultMessage: 'Adresse e-mail ou mot de passe invalide.',
  },

  logInQuestion: {
    id: 'account.signup-form.signup-question',
    defaultMessage: 'Déjà membre?',
  },

  logIn: {
    id: 'acccount.signup-form.login',
    defaultMessage: 'Connexion',
  },

  signUp: {
    id: 'acccount.signup-form.signup-action',
    defaultMessage: 'Inscription',
  },

  emailNote: {
    id: 'account.signup-form.email-note',
    defaultMessage: 'Vous recevrez occasionnellement des e-mails liés à ton compte. Nous promettons de ne pas partager votre email avec n’importe qui.',
  },
  termsOfService: {
    id: 'account.signup-form.terms-of-service',
    defaultMessage: 'Conditions d’utilisation',
  },

  privacyPolicy: {
    id: 'account.signup-form.privacy-policy',
    defaultMessage: 'Confidentialité',
  },

  tos: {
    id: 'account.signup-form.tos',
    defaultMessage: 'En cliquant sur ”{action}” au-dessous, Vous acceptez les {termsOfService} et la {privacyPolicy}.',
  },

});


