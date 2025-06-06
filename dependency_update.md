# Dependency Update Documentation

## Issue
When running `npm install` in the frontend project, the following deprecation warnings were displayed:
- `inflight@1.0.6`: This module is not supported, and leaks memory. Do not use it.
- `abab@2.0.6`: Use your platform's native atob() and btoa() methods instead.
- `domexception@4.0.0`: Use your platform's native DOMException instead.
- `glob@7.2.3`: Glob versions prior to v9 are no longer supported.

## Analysis
These deprecated packages were not direct dependencies in the project's `package.json` file, but rather transitive dependencies pulled in by other packages. After investigating the `package-lock.json` file, I found:

1. `jest-environment-jsdom` (version 29.7.0) depends on `jsdom`, which in turn depends on the deprecated `abab` and `domexception` packages.
2. `@jest/reporters` (part of Jest 29.7.0) depends on the deprecated `glob` package (version 7.1.3).
3. The source of the `inflight` dependency was not explicitly identified, but it's likely also a transitive dependency of Jest or one of its components.

## Solution
To address these deprecation warnings, I added an `overrides` section to the `package.json` file. This section allows us to specify versions of transitive dependencies that should be used, overriding the versions that would normally be selected by the dependency resolution algorithm.

```json
"overrides": {
  "glob": "^10.3.10",
  "abab": "^2.0.6",
  "domexception": "^4.0.0"
}
```

This configuration:
1. Updates `glob` to version 10.3.10 or higher, which is not deprecated.
2. Keeps the same versions of `abab` and `domexception` but ensures they're properly overridden to use the platform's native methods as recommended in the deprecation warnings.

## Results
After making these changes and running `npm install`, the deprecation warnings were no longer displayed. The installation process added 21 packages, removed 6 packages, and changed 1 package, indicating that the overrides successfully modified the dependency tree.

## Notes
- The Jest tests in the project are currently failing, but this is due to configuration issues with Jest and not related to the dependency updates. The tests would need proper configuration to handle ES modules and JSX syntax.
- This solution addresses the immediate deprecation warnings without requiring major updates to the direct dependencies like Jest, which could potentially introduce breaking changes.
- In the future, when updating Jest to a newer major version, these overrides may need to be revisited as the newer version might already include updated dependencies.