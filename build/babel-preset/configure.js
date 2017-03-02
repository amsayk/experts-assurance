'use strict';

/* eslint-disable indent */

module.exports = function (options) {
  options = Object.assign({
    autoImport: true,
    inlineRequires: process.env.NODE_ENV === 'test',
    objectAssign: true,
    rewriteModules: null, // {map: ?{[module: string]: string}, prefix: ?string}
    stripDEV: false,
    target: 'js',
    modules: false,
  }, options);

  if (options.target !== 'js' && options.target !== 'flow') {
    throw new Error('options.target must be one of "js" or "flow".');
  }

  if (typeof options.modules !== 'boolean') {
    throw new Error('options.modules must be true or false.');
  }

  // Always enable these. These will overlap with some transforms (which also
  // enable the corresponding syntax, eg Flow), but these are the minimal
  // additional syntaxes that need to be enabled so we can minimally transform
  // to .js.flow files as well.
  let presetSets = [
    [
      require.resolve('babel-plugin-syntax-class-properties'),
      require.resolve('babel-plugin-syntax-flow'),
      require.resolve('babel-plugin-syntax-jsx'),
      require.resolve('babel-plugin-syntax-trailing-function-commas'),
      require.resolve('babel-plugin-syntax-object-rest-spread'),

      options.autoImport ? require.resolve('babel-preset-fbjs/plugins/auto-importer') : null,
      options.rewriteModules ?
        [require.resolve('babel-preset-fbjs/plugins/rewrite-modules'), options.rewriteModules || {}] :
        null,
    ],
    [
      options.inlineRequires ? require.resolve('babel-preset-fbjs/plugins/inline-requires') : null,
      options.stripDEV ? require.resolve('babel-preset-fbjs/plugins/dev-expression') : null,
    ],
  ];

  // We only want to add declarations for flow transforms and not for js. So we
  // have to do this separate from above.
  if (options.target === 'flow') {
    presetSets[0].push(require.resolve('babel-preset-fbjs/plugins/dev-declaration'));
  }

  // Enable everything else for js.
  if (options.target === 'js') {
    presetSets[0] = presetSets[0].concat([
      require.resolve('babel-plugin-transform-es2015-template-literals'),
      require.resolve('babel-plugin-transform-es2015-literals'),
      require.resolve('babel-plugin-transform-es2015-function-name'),
      require.resolve('babel-plugin-transform-es2015-arrow-functions'),
      require.resolve('babel-plugin-transform-es2015-block-scoped-functions'),
      require.resolve('babel-plugin-transform-class-properties'),
      [require.resolve('babel-plugin-transform-es2015-classes'), {loose: true}],
      require.resolve('babel-plugin-transform-es2015-object-super'),
      require.resolve('babel-plugin-transform-es2015-shorthand-properties'),
      require.resolve('babel-plugin-transform-es2015-computed-properties'),
      require.resolve('babel-plugin-transform-es2015-for-of'),
      require.resolve('babel-plugin-check-es2015-constants'),
      [require.resolve('babel-plugin-transform-es2015-spread'), {loose: true}],
      require.resolve('babel-plugin-transform-es2015-parameters'),
      [require.resolve('babel-plugin-transform-es2015-destructuring'), {loose: true}],
      require.resolve('babel-plugin-transform-es2015-block-scoping'),
      options.modules ? require('babel-plugin-transform-es2015-modules-commonjs') : null,
      require.resolve('babel-plugin-transform-es3-member-expression-literals'),
      require.resolve('babel-plugin-transform-es3-property-literals'),
      require.resolve('babel-plugin-transform-flow-strip-types'),
      require.resolve('babel-plugin-transform-object-rest-spread'),
      require.resolve('babel-plugin-transform-react-display-name'),
      require.resolve('babel-plugin-transform-react-jsx'),
      // Don't enable this plugin unless we're compiling JS, even if the option is true
      options.objectAssign ? require.resolve('babel-preset-fbjs/plugins/object-assign') : null,
    ]);
  }

  // Use two passes to circumvent bug with auto-importer and inline-requires.
  const passPresets = presetSets.map(function (plugins) {
    return {
      plugins: plugins.filter(function (plugin) {
        return plugin != null;
      }),
    };
  });

  return {
    passPerPreset: true,
    presets: passPresets,
  };
};

