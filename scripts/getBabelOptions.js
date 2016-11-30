'use strict';

const objectAssign = require('object-assign');

module.exports = function (options) {
  options = objectAssign({
    env: 'production',
    moduleMap: {},
    plugins: [],
  }, options);
  let { passPerPreset, presets } = require('babel-preset-fbjs/configure')({
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
  });

  // Ugly hack!!!
  presets = presets.map(function (preset, i) {
    if (i === 0) {
      return {
        plugins: ['transform-regenerator'].concat(preset.plugins),
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

