# Build tools

This guide outlines the available commands and tools to build, test and assure code quality of the Lyvely core platform.

## Quality Assurance (QA)

The following commands can be used to analyze and ensure the quality of the Lyvely monorepo:

- `rush test`: Runs unit tests for all packages.
- `rush ncu`: Runs [npm-check-update](https://github.com/raineorshine/npm-check-updates) in order to check for version updates.
At the moment it is recommended to only check for specific packages by using the `--only` optiond.
- `rush depcheck`: Will run [depcheck](https://github.com/depcheck/depcheck) to detect unused or missing dependencies.
- `rush deps`: All packages use [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) for checking for 
cyclic dependencies within a package and other dependency policies within and between packages.
- `rush format`: Runs `prettier --fix` on all packages to ensure a unified and clean code format.
- `rush prettier`: Runs `prettier` without the `fix` option on all packages.
- `rush lint`: Runs `eslint` on all packages.
- `rush check`: Checks each project's package.json files and ensures consistent dependency package versions among all packages
in the monorepo.

### Version Policies

The monorepo facilitates the [ensureConsistentVersions](https://rushjs.io/pages/maintainer/recommended_settings/#ensureconsistentversions)
option in order to ensure all packages within the repo use the same versions for its package dependencies. 
And version [rush version policies](https://rushjs.io/pages/maintainer/publishing/#3-version-policy) between related packages
for example between **api**, **web** and **interface** packages of a feature.

### CI

The monorepo uses [Github Actions](https://github.com/features/actions) workflow for:

- Pull Request testing and validation

## Build packages

After the first checkout of the project run `rush build`

For building all packages run the `rush build` or `rush rebuild` command. If you want to build a single package e.g.
*@lyvely/web* run the `rush build --only @lyvely/web` command. Please refer to the [rush documentation](https://rushjs.io/pages/developer/selecting_subsets/)
 for other package selection strategies.

The `rush build` command should be executed 
 - after any changes in *package.json* 
 - after a `git pull`
 - after manual changes within the `common/config` directory

:::tip
Check the [rush documentation](https://rushjs.io/pages/developer/) for more information the management of monorepos.
:::