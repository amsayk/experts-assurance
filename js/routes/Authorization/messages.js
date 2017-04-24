import { defineMessages } from 'react-intl';

export default defineMessages({
  logOut: {
    id: 'authorization-page.logOut',
    defaultMessage: 'Déconnexion',
  },

  Thanks: {
    id: 'authorization.thanks',
    defaultMessage: `
      Merci d'utiliser {appName}.
    `,
  },
  AuthorizationPending: {
    id: 'authorization.authorization_pending',
    defaultMessage: `
      Vous devez avoir authorization d'un administrateur pour pouvoir utiliser Fikrat.
    `,
  },

});

