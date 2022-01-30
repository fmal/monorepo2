// @ts-check
'use strict';

// @ts-ignore
const isPrerelease = process.env.PRERELEASE === 'true';
// @ts-ignore
const isCI = Boolean(process.env.CI);

/**
 * @type {import('@monodeploy/types').MonodeployConfiguration}
 **/
const monodeployConfig = {
  prerelease: isPrerelease,
  prereleaseId: 'next',
  prereleaseNPMTag: 'next',
  persistVersions: true,
  autoCommit: true,
  autoCommitMessage: `chore(release): 🤖 packages ${isPrerelease ? 'pre-' : ''}release [skip ci]`,
  plugins: isCI ? ['@monodeploy/plugin-github'] : [],
  conventionalChangelogConfig: 'conventional-changelog-conventionalcommits',
  changelogFilename: !isPrerelease ? '<packageDir>/CHANGELOG.md' : undefined,
  access: 'infer',
  // @ts-ignore
  git: {
    push: true
  },
  commitIgnorePatterns: ['^chore\\(release\\):'],
  changesetIgnorePatterns: [
    '**/*.test.{js,ts,tsx}',
    '**/*.md'
  ],
  topological: true
};

module.exports = monodeployConfig;
