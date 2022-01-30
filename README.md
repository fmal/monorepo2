# monorepo2

<!-- prettier-ignore-start -->
| Branch | Status |
| --- | :---: |
| next | ![CI Workflow](https://github.com/fmal/monorepo2/actions/workflows/ci.yml/badge.svg?branch=next) |
| main | ![CI Workflow](https://github.com/fmal/monorepo2/actions/workflows/ci.yml/badge.svg) |
<!-- prettier-ignore-end -->

The monorepo is installed using [yarn](https://github.com/yarnpkg/berry), and relies on [yarn workspaces](https://yarnpkg.com/features/workspaces).

## 📦 Release process

Review and merge PRs into default `next` branch.

You can [trigger a beta release of the packages](https://github.com/fmal/monorepo2/actions/workflows/release.yml) from the changes on the `next` branch.

When the state of the `next` branch is ready to become a production release, merge `next` into `main`. After pushing to the `main` branch [monodeploy](https://tophat.github.io/monodeploy/) creates a stable release of the packages with release notes auto-generated from the commit messages.

Commits with the fix type trigger a patch version release, commits with feat type a minor version release and commits with breaking changes a major version release.

```sh
# ensure the main and development branches are both up to date
git checkout next
git pull
git checkout main
git pull

# merge the stable next snapshot
git merge --ff-only next

# push the main branch to shared respository
git push main
```
