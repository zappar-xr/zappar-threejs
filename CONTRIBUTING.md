[[_TOC_]]

## Overview

This project wraps [zappar-js](https://repos.zappar.com/vision/zappar-js) computer vision library around [three.js](https://github.com/mrdoob/three.js/).

It's deployed in a number of ways:

- as an NPM package (@zappar/threejs)
- as a standalone JavaScript file that can be referenced from users' `<script>` nodes via our CDN
- as a ZIP of the JavaScript and necessary other files that can be downloaded for users to include in their projects

## Structure

This project takes the form of a npm package, complete with `package.json`.

The `src` directory contains the TypeScript that implements the majority of the project.

Once built, the `lib` folder contains compiled JavaScript equivalents of the files in `src`. It's these files that are used when the project is installed as a dependency through NPM.

The `umd` folder contains a webpack-bundled version of the project that forms the standalone version for access through the CDN or ZIP download.

The `tests` folder contains a number of manual and jest-puppeteer pages for manual and automatic testing (see below).

## Building

To build this project you just need node.js.

First step is to download all the necessary dependencies from NPM:

```bash
npm ci
```

Next, build the module version of the project (and thus populate the `lib` folder):

```bash
npm run build:module
```

Finally build the standalone version (populating the `umd` folder):

```bash
npm run build:standalone
```

Alternatively, you can build lib, umd and tests using a single command:

```bash
npm run build
```

## Code Styling

This project uses `Airbnb JavaScript Style`, find more info about it here: [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript/blob/master/README.md).

`Husky` enforces the styling guide using `pre-commit` hooks. You should use the `ESLint` extension for your editor:

VS Marketplace Link: <https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint>
ATOM Plugin link : <https://atom.io/packages/linter-eslint>
Sublime Plugin Link: <https://github.com/SublimeLinter/SublimeLinter-eslint>
JetBrains Marketplace Link: <https://plugins.jetbrains.com/plugin/7494-eslint>

`no-restricted-imports: error` is set for importing `three`. You **must** import `THREE` from `./src/three.ts`.

## Testing

There both automated and manual tests for available for your use.

This project uses `webpackHTMLPlugin` to build and serve both manual and automated tests.

### HTML Templates

The HTML templates are stored inside `/tests/html-templates` folder.
When adding a new template, please ensure it has a numeric file name. i.e `5.html`. (see below for explanation)

### Manual Tests

The `tests/manual` folder has some test web pages for the different tracking types and options.

New manual test web pages can be added by creating a new .ts file in the `/tests/manual` folder. This file needs to have the following naming convention:
`_template<N>_myNewTest.ts` Replace `<N>` with the name of the HTML template you would like to use. For example:
`/tests/manual/_template2_myNewTest.ts` would use `/tests/html-templates/2.html` and output `/test-dist/pages/manual/myNewTest.ts`. No extra `webpack` configuration is needed.

You can build and serve these using `webpack` with the following command:

```bash
npm run tests
```

### Automated Tests

There are a set of automated tests that have been built using Puppeteer and Jest.

Automated tests are evaluated against `standalone` and `module` builds. You do not need to manually create `standalone` web pages. `webpack` will generate them for you.

#### Adding new automated tests

The general workflow of adding new automated test is as follows:

1. Create a new test page by making a `_template1_myNewTest.ts` (See Manual Tests section for naming explanation) file in `tests/jest/module`.
2. Ensure page is rendered as expected by running it using `npm run tests` and navigating to the output.
3. `webpack` will automatically generate a `standalone` web page in `./tests/jest/generated-standalone/`. For this to work, there are some rules to follow:
    - **You must not use typescript features in the test pages** - Your code has to be valid JS.
    - **Any THREE and ZapparThree imports must come from ./common** - These must be surrounded by `build-remove` comments. See existing tests for reference.
4. Create a new jest-puppeteer test. Follow the format of existing tests found in `./tests/`.

Running tests for first time will generate a screenshot in `./tests/__image_snapshots__`. Please verify this screenshot is correct before committing it to the repository.

*note you can hot-reload preview your tests using `npm run tests`*

You can run automated tests using the following commands:

```bash
npm run test
```

### Sequences

The library has the ability to record short sequences of camera and motion data such that it can be replayed at a later date. This is useful for regression and performance testing.

The manual tests have two buttons along the bottom toolbar:

- 'Rec' starts capturing a 5 second sequence, then downloads the resulting data as a file.
- 'Play' that lets you select a file and plays it back.

You can trigger sequence recording using the following API:

```ts
pipeline.sequenceRecordStart(expected_frames?: number) : void;
pipeline.sequenceRecordStop() : void;
pipeline.sequenceRecordData() : ArrayBuffer;
```

You can subsequently play a sequence using `SequenceSource` as an alternative to `CameraSource`:

```ts
new SequenceSource(pipeline: pipeline_t)
sequenceSource.load(src: string | ArrayBuffer) : void;
sequenceSource.start() : void;
```

