# Changelog

## [0.3.40] - 2022-02-29

### Fixed

- Bumped `peerDependencies` `three` to  `"0.118.0 - 0.139.0"`

## [0.3.39] - 2022-02-29

### Fixed

- Addressed texture encoding issues for the camera background texture with recent three.js versions.

## [0.3.38] - 2022-03-07

### Changed

- Undo changes introduced in `0.3.36`.

## [0.3.37] - 2022-02-15

### Changed

- `ZapparThree.CameraEnvironmentMap` and `ZapparThree.Camera.backgroundTexture` encoding is set automatically.

## [0.3.36] - 2022-02-11

### Changed

- `ZapparThree.CameraEnvironmentMap` now extends `THREE.Texture`.

## [0.3.35] - 2022-02-11

### Changed

- Internals - Moved `Camera`'s `backgroundTexture` into its own class.

## [0.3.34] - 2022-02-08

### Fixed

- External WebGL state is preserved during `process_gl` calls.
- Bumped supported `three` versions up to `0.137.5`.
- Updated dependencies.

## [0.3.33] - 2021-11-01

### Changed

- Pinned dependencies to exact versions

## [0.3.32] - 2021-09-30

- Bumped `three` support to `0.131.1`.

## [0.3.31] - 2021-09-23

### Added

- LibraryLoader that ensures that the library is full loaded before any loading UI is dismissed
- loaded() function which returns true once the library is fully loaded and available for use
- loadedPromise() function which returns a promise that resolves once the library is fully loaded and available for use

### Changed

- Bucket 172.* IP address range into one license check.

### Fixed

- Issues with other browsers on iOS, including social browsers
- Loaders for trackers and masks not registering items with the LoadingManager

## [0.3.30] - 2021-08-24

### Fixed

- An issue where `facebuffergeometry` would not initialize it's `position`, `normal`, and `uv` attributes.

## [0.3.29] - 2021-08-20

- Updated `@zappar/zappar`.

### Added

- `.stop()` method to the `ZapparThree.Camera`, this is used to stop (non-destructive) the camera sources.

### Fixed

- Multi face tracking bug - [#85](https://github.com/zappar-xr/zappar-threejs/issues/85)
- The camera will no longer automatically start (if has not been previously started) on `visibilitychange`.

## [0.3.28] - 2021-07-05

### Added

- Realtime Camera-based environment map. This is exported as `CameraEnvironmentMap`.
- `Realtime Camera-based Reflections` section to `README.md`
- `CameraEnvironmentMap` tests.

## [0.3.27] - 2021-06-28

### Fixed

- An issue where `ZapparCamera` would not work on react-three-fiber.

## [0.3.26] - 2021-06-25

- Updated dependencies.
  - Bumped `three` support to r128.
  - Minimum supported `three` version raised to `r118`.

### Added

- Author url to `package.json`.
- `Links and Resources` section to `README.md`.

#### TypeDoc

- Code Comments.
- TypeDoc generated documentation is hosted on GitHub Pages: <https://zappar-xr.github.io/zappar-threejs/>

#### ESLint

- Pre-commit Husky hooks to enforce eslint rules.
- `CONTRIBUTING.MD`:
  - Added `Code Styling` section.
  - Added notes regarding `Husky`.
  - Added notes regarding `eslint`.
  - Added notes regarding custom `ESLint` rules.
- `package.json`:
  - Added `husky` and `lint-staged` configs.

### Changed

#### Source Directories

- `src` now has `geometry`, `loaders`, `mesh` and `trackers` subdirectories. The following files have been moved from `./src/` into subdirectories:
  - `src/geometry/facebuffergeometry.ts`
  - `src/loaders/facemeshloader.ts`
  - `src/loaders/facetrackerloader.ts`
  - `src/loaders/headmaskmeshloader.ts`
  - `src/loaders/imagetrackerloader.ts`
  - `src/loaders/loadingmanager.ts`
  - `src/mesh/headmaskmesh.ts`
  - `src/trackers/faceanchorgroup.ts`
  - `src/trackers/facelandmarkgroup.ts`
  - `src/trackers/imageanchorgroup.ts`
  - `src/trackers/instantworldanchorgroup.ts`

#### ESLint

- Now using AirBnB `ESLint` config alongside `prettier/recommended` plugin.
  - This is enforced using `Husky` `pre-commit` hooks and `lint-staged`.
  - Added `eslint-webpack-plugin` to enforce code style.
- *(internal)* `THREE` import validation is now handled by eslint.

#### Tests Refactor

- Tests now use `jest-image-snapshot` for snapshot testing.
- All tests moved to `./tests/`.
- Dramatically reduced test time by running console & snapshot tests in a single `it` block.
- Expected screenshots are now stored in `tests/__image_snapshots__/`.
- Screenshot diff artifacts are now saved in `tests/__image_snapshots__/__diff_output__`.
- Standalone THREE versions to test against now come from `standalone-versions.js`.
- Added `webpack.helper.js`. This helper is used to automatically generate standalone test pages. (`tests/jest/module/*.ts` → `tests/jest/generated-standalone/*.js`)
- Added `kill-test-process` script to stop any processes running on the port 8081.
- Added `test:post` script to `package.json`.

### Removed

- No longer used dependencies and their corresponding `DT` packages: `pngjs`, `pixelmatch`, `concurrently`, `@zappar/zapworks-cli`.

### Fixed

- `CHANGELOG.md` markdown formatting.
- `lint` and `lint:fix` scripts in `package.json`.
- `README.MD` markdown formatting.

## [0.3.24] - 2021-04-23

- Updated `@zappar/zappar-js`

### Added

- `zNear` and `zFar` options to `ZapparThree.Camera`, allowing custom clipping planes distances.

## [0.3.23] - 2021-04-21

- Updated `@zappar/zappar`
- Tracker groups matrices are now decomposed into the object's respective transforms.
- Migrated testing utils to `@zappar/test-utils`

### Added

- Caveats section to `README.MD`

### Fixed

- Version typo in `CHANGELOG.md`
- Workaround for deprecated `removeAttribute`

## [0.3.22] - 2021-04-08

### Changed

- `Camera` source options now take `HTMLImageElement` | `HTMLVideoElement` | `string` instead of `CameraSource` | `string`.

## [0.3.11] - 2021-04-07

- Updated ThreeJs to 0.127.0

### Fixed

- Fallback to getInverse for threejs versions before 0.123.x

## [0.3.9-0.3.10] - 2021-03-12

- @zappar/zappar-threejs-for-aframe is now deployed alongside @zappar/zappar-threejs

## [0.3.8] - 2021-03-08

## Added

- Options to `Camera` constructor, allowing custom video devices to be used.
- logLevel() and setLogLevel(...) to customize volume of log output
- glContextLost() to indicate that the GL context is lost

## Changed

- Open-sourcing on GitHub
- Updated dependencies
- License check now happens when the first `ZapparCamera` or `Pipeline` is created

### Fixed

- pipeline.glContextSet(...) correctly handles multiple invocations

## [0.3.7] - 2021-02-03

## Changed

- Updated dependencies
- Updated README to reference support for iOS WKWebView from iOS 14.3 and later

### Added

- Table of contents to `README.md`
- `.SkipVersionLog` to disable console logging current version
- ESLint
- Issue templates - `bug_report.md` & `feature_request.md`
- Dependabot
- Build status badges to `README.md`

### Fixed

- All internal methods now have valid return types

## [0.3.6] - 2020-12-1

### Changed

- Bumped Three version to 0.123.0
- If available, camera sets `projectionMatrixInverse` using `invert` instead of deprecated `getInverse`.

## [0.3.5] - 2020-11-26

### Added

- This changelog :-)
- Console log the version when the library is initialized
- Export `Pipeline` object
- Pipeline `destroy()` function

### Fixed

- Ensure internal GL usage correctly sets the expected active texture
- Prevent flickering when there are no new camera frames
- Fixed building with recent versions of `worker-loader`

### Changed

- Dependencies update
- Remove unnecessary console logging

## [0.3.4] - 2020-11-05

### Fixed

- Correctly export browser compatibility API

## [0.3.3] - 2020-11-05

### Added

- Browser compatibility API and UI
- README section detailing browser support
- `DefaultLoaderUI` that wraps THREE's default loader

### Changed

- Modifications to browser compatibility API

### Fixed

- Support for Firefox
- Camera now correctly destroys the two CameraSource objects it owns
- Fixed some typos in README.md

## [0.3.2] - 2020-11-03

### Fixed

- Export new face landmark functionality

## [0.3.1] - 2020-11-03

### Added

- Support for face landmarks
- Greatly improved face tracking model

### Fixed

- Fixes to iPad support

### Changed

- Dependencies update

## [0.2.16] - 2020-10-29

### Fixed

- Support for ThreeJS versions >= 0.118.*
- Fixed issue where face meshes disappear when close to the edge of the screen

### Changed

- Introduced accurate ThreeJS peer dependency versioning

## [0.2.15] - 2020-10-19

### Fixed

- Fixes to iPad support

### Changed

- Dependencies update

## [0.2.14] - 2020-09-17

### Added

- Remove circular reference in dispose functions

## [0.2.13] - 2020-09-17

### Added

- Functions to THREE objects to dispose of underling Zappar JS objects

## [0.2.12] - 2020-09-16

### Changed

- README syntax highlighting improvements

## [0.2.11] - 2020-09-15

### Fixed

- Fix issues with iOS 14

### Changed

- Dependencies update

## [0.2.7] - 2020-07-08

### Fixed

- Tweaks to computer vision algorithms

## [0.2.6] - 2020-07-08

### Fixed

- Tweaks to computer vision algorithms
- Fixed to the README

## [0.2.5] - 2020-06-12

### Fixed

- Use browser `visiblitychange` event to pause/start camera when user changes tabs

## [0.2.4] - 2020-06-10

### Added

- Support for full head meshes

## [0.2.3] - 2020-06-02

### Added

- Support for NGROK
- Added README.md clarifications around licensing
- Mobile-optimized LoadingManager UI

## [0.2.2] - 2020-05-26

Initial release
