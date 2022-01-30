'use strict';

require('eslint-config-fmal/patch/modern-module-resolution');

module.exports = {
  extends: ['fmal', 'fmal/import', 'fmal/typescript'],
  overrides: [
    {
      files: ['**/__tests__/**'],
      extends: ['plugin:jest/recommended']
    },
    {
      files: ['*.js'],
      rules: {
        'import/no-commonjs': 'off' // Allow CommonJS imports
      }
    }
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: __dirname
      }
    }
  }
};
