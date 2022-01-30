'use strict';

const baseConfig = require("./jest.base.config.js")

module.exports = {
  ...baseConfig,
  rootDir: __dirname,
	projects: [
		'<rootDir>/packages/*',
	],
  collectCoverageFrom: [
    'packages/*/src/**/*.{js,ts,tsx}',
    '!**/*.d.ts',
    '!**/__tests__/**'
  ]
}
