import Parse from 'parse/node';

import publish from 'backend/kue-mq/publish';

import { serializeParseObject, deserializeParseObject } from 'backend/utils';

import MailgunAdapter from 'parse-server-mailgun';

const log = require('log')('app:backend:mail');

class MailAdapter {
  constructor(options) {
    this.mailgunAdaper = new MailgunAdapter(options);
  }

  /*
   * A method for sending mail
   * @param options would have the parameters
   * - to: the recipient
   * - text: the raw text of the message
   * - subject: the subject of the email
   */
  sendMail(options) {}

  /**
   * sendMail wrapper to send an email with password reset link
   * The options object would have the parameters link, appName, user
   * @param {Object} options
   * @returns {Promise}
   */
  sendPasswordResetEmail({ link, appName, user }) {
    const request = {
      params : { templateName: 'passwordResetEmail', link, appName, user : serializeParseObject(user) },
    };
    return publish('MAIL', '_sendMail', request);
  }

  /**
   * sendMail wrapper to send an email with an account verification link
   * The options object would have the parameters link, appName, user
   * @param {Object} options
   * @returns {Promise}
   */
  sendVerificationEmail({ link, appName, user }) {
    const request = {
      params : { templateName: 'verificationEmail', link, appName, user : serializeParseObject(user) },
    };
    return publish('MAIL', '_sendMail', request);
  }

  /**
   * sendMail wrapper to send general purpose emails
   * The options object would have the parameters:
   * - templateName: name of template to be used
   * - subject: overrides the default value
   * - fromAddress: overrides the default from address
   * - recipient: email's recipient
   * - variables: An object whose property names represent template variables,
   *              and whose values will replace the template variable placeholders
   * @param {Object} options
   * @returns {Promise}
   */
  send({ templateName, subject, fromAddress, recipient, variables }) {
    const request = {
      params : { templateName, subject, fromAddress, recipient, variables, direct: true },
    };
    return publish('MAIL', '_sendMail', request);
  }

  _sendMail(options) {
    if (options.user) {
      options.user = deserializeParseObject(options.user);
    }

    return this.mailgunAdaper._sendMail(options);
  }
}

module.exports = MailAdapter;

