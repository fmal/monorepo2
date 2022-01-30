'use strict';

const isCI = Boolean(process.env.CI);

module.exports = {
  collectCoverage: isCI,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,ts,tsx}',
    '!**/*.d.ts',
    '!**/__tests__/**'
  ],
  coverageReporters: ['text', isCI && 'lcov'].filter(Boolean),
  bail: isCI
}
