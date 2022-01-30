'use strict';

const baseConfig = require('../../jest.base.config');
const pkg = require('./package.json');

module.exports = {
  ...baseConfig,
  displayName: pkg.name,
  testEnvironment: 'jsdom',
  rootDir: __dirname,
  roots: ['<rootDir>/src'],
  transform: {
    '\\.(js|tsx?)$': ['babel-jest', { rootMode: 'upward' }]
  }
};
