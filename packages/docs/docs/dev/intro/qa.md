# Quality Assurance

The monorepo includes some tools and commands for quality assurance purposes as described in the following sections.

## QA commands

- `rush test`: Runs unit tests for all packages.
- `rush ncu`: Runs [npm-check-update](https://github.com/raineorshine/npm-check-updates) in order to check for version updates.
At the moment it is recommended to only check for specific packages by using the `--only` optiond.
- `rush depcheck`: Will run [depcheck](https://github.com/depcheck/depcheck) to detect unused or missing dependencies.
- `depcruise`: For more complex packages we use [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) which is ideal for
  checking for cyclic dependencies within a package and other dependency policies within and between packages.
- `rush format`: Runs `prettier --fix` on all packages.
- `rush prettier`: Runs `prettier` on all packages.
- `rush lint`: Runs `eslint` on all packages.
- `rush check`: Checks each project's package.json files and ensures that all dependencies are of the same version 
throughout the repository.

## Version Policies

The monorepo also facilitates the [ensureConsistentVersions](https://rushjs.io/pages/maintainer/recommended_settings/#ensureconsistentversions)
option in order to ensure all packages within the repo use the same versions for its package dependencies. 
And version [rush version policies](https://rushjs.io/pages/maintainer/publishing/#3-version-policy) between related packages
for example between **api**, **web** and **interface** packages of a feature.

## CI

The monorepo uses [Github Actions](https://github.com/features/actions) workflow for:

- Pull Request testing and validation
