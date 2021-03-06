
0.1.6 / 2017-01-24
==================

  * Merge branch 'bug/Issue7': Add support for standalone node.
  * Add git pre-commit hook to lint and test
  * Fix `NODE_PATH`.
  * By default, enable SSR in production mode.
  * Revert "Replace `NODE_PATH` with `app-module-path`"
  * Fix minor issue.
  * Make `HOST` an env to easily use `localhost`;
  * For now, turn off SSR by default.

0.1.5 / 2017-01-23
==================

  * Improve SSR.

0.1.4 / 2017-01-23
==================

  * Improve login form.
  * Add profile info to header.
  * Icon component.
  * Don't let body overflow.

0.1.3 / 2017-01-18
==================

  * Improved scrolling.
  * Simplify graphql loader hook.
  * Implement webpack tree shaking.
  * Fix offline plugin cache error in production mode.
  * Correctly minify html.
  * Delay load animation

0.1.2 / 2017-01-15
==================

  * [EXPERIMENTAL]: Add support for SSR.
  * Update failing tests.

0.1.1 / 2017-01-13
==================

  * Site notifications, many improvements and bug fixes.
  * Partially resolve Issue #4.
  * Improve sign up process.
  * Improve linting.
  * Add notification after resending email verification.
  * Partially resolve Issue #4.
  * Fix: Issue #3.
  * Use snackbar in password reset.
  * Revamp snackbar. Prepare for site notifications.
  * Add immutable proptypes.
  * Small fix.
  * Small fix.
  * Dedupe style imports.
  * Update bootstrap.
  * A few optimizations.
  * Update deps.

0.1.0 / 2017-01-04
==================

  * Minor fix.
  * Phone number validation.
  * Fix: Do not update values in case of errors.
  * Polyfill `require.ensure` on node.
  * Validate zip code for US.
  * Kill getLangFromReq.
  * Fix return to previous location after login and increase auto-logout timeout to 15 minutes.
  * Implement business id.
  * Add country.
  * Add business website.
  * Fix FormMessages and related tests.
  * Revert dashboard and graphiql weired access. Just variables in .env for now.
  * Merge branch 'chore/change_email'
  * Implement change password.
  * Fix ignoring sensitive info in resolvers.
  * Animated Snackbar.
  * Add duration to Snackbar.
  * Cross-platform icons.
  * variables.scss -> _variables.scss
  * Access parse dashboard and graphiql more naturally.
  * Minor improvements.
  * Fix auto logout.
  * variables.scss -> _variables.scss
  * Access parse dashboard and graphiql more naturally.
  * Minor improvements.
  * Fix auto logout.
  * Don't send master key to the client.
  * Subscriptions initial stub.
  * Kill `onbeforeunload`. We will implement a `NavigationPrompt` later.
  * Small fix.
  * Centralized logging.
  * Small fix.
  * Cross-platform observers.
  * Use lightweight debounce.
  * [EXPERIMENTAL] Upgrade to webpack 2.
  * Clean schema.
  * Small fix.
  * Business registration, account settings and password change.
  * Fix a regression in `store` that prevented startedup.
  * Perform tests.
  * Remove express user-agent detection.
  * Node locale support.
  * Lint styles.
  * Fix notifications hidden.
  * Update deps.
  * Initial experimental support for theming.
  * Improve translations.
  * Make parse dashboard work.
  * Merge chunks.
  * Use single quotes consistently.
  * Display better errors messages...
  * Inline logo.
  * Better encapsulation.
  * One too many 'env'.
  * More renames.
  * Fix wrong naming.
  * Add support for linting graphql.
  * Fix comment.
  * Settle masterKey/sessionToken issues.
  * Just use redux's compose for now.
  * Update apollo-server.
  * User authentication initial commit.
  * Fix linting. Code now conforms to eslint config.
  * Cleanups.
  * Test resolver generators.
  * Setup initial test environment.
  * Minor tweaks.
  * Initiate readme.
  * Rename `BATCHING_INTERVAL` to `APOLLO_QUERY_BATCH_INTERVAL`.
  * Fix logging.
  * Load parse base on the execution environment: `parse/node` on server, `parse` in browser.

v0.0.1 / 2016-11-28
===================

  * Initial commit.
