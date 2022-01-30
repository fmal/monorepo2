'use strict';

const pkg = require('./package.json');

module.exports = api => {
  const isTest = api.cache(() => process.env.NODE_ENV === 'test');
  const babelEnv = api.cache(() => process.env.BABEL_ENV);

  const envTargets = isTest ? { node: 'current' } : { browsers: ['ie >= 11'] };

  const envOpts = {
    loose: true,
    modules: babelEnv === 'cjs' || isTest ? 'commonjs' : false,
    targets: envTargets,
    bugfixes: true,
    exclude: [
      'transform-typeof-symbol',
      // we don't want these because we're using fast-async instead
      'transform-regenerator',
      'transform-async-to-generator',
      'proposal-async-generator-functions'
    ]
  };

  const presets = [['@babel/preset-env', envOpts], '@babel/preset-typescript'];

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: babelEnv === 'cjs' ? 3 : false,
        version:
          babelEnv === 'cjs'
            ? pkg.dependencies['@babel/runtime-corejs3']
            : pkg.dependencies['@babel/runtime'],
        regenerator: false,
        useESModules: babelEnv === 'es'
      }
    ],
    isTest ? null : ['module:fast-async', { spec: true }]
  ].filter(Boolean);

  return {
    comments: false,
    minified: true,
    presets,
    plugins,
    ignore: babelEnv === 'cjs' || babelEnv === 'es' ? ['**/__tests__/**'] : []
  };
};
