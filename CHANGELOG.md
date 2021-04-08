# Changelog

## [0.3.12] - 2021-04-08
## Changed
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
