'use strict';

const objectAssign = require('object-assign');

module.exports = function (options) {
  options = objectAssign({
    env: 'production',
    moduleMap: {},
    plugins: [],
    modules: false,
    regenerator : true,
  }, options);
  let { passPerPreset, presets } = require('build/babel-preset/configure')({
    autoImport: true,
    inlineRequires: true,
    rewriteModules: {
      map: objectAssign({},
        require('fbjs-scripts/third-party-module-map'),
        require('fbjs/module-map'),
        options.moduleMap
      ),
      prefix: '',
    },
    stripDEV: options.env === 'production',
    modules: options.modules,
  });

  // Ugly hack!!!
  presets = presets.map(function (preset, i) {
    if (i === 0) {
      return {
        plugins: options.regenerator ? [
          'transform-regenerator'
        ].concat(preset.plugins) : preset.plugins,
      };
    }
    return preset;
  });
  return {
    plugins : options.plugins,
    presets : {
      passPerPreset,
      presets,
    },
  };
};

