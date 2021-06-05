# ABC Diversity Puzzle Trails

This is the monorepo for the ABC Diversity Puzzle Trails Companion App.

Issue overview: [Project Board](https://github.com/barnslig/diversity-puzzle-trails/projects/1)

## Technical Documentation

The technical documentation is targeted at a technical audience and represents the most recent state of the technical architecture.

Link: [Technical Documentation](https://abc-dpt-docs.netlify.app/)

### Working on the documentation

The documentation is written in Markdown, located at `docs/` and build using [mdBook](https://github.com/rust-lang/mdBook).

On `git push`, the Netlify deployment is automatically updated.

In order to build it locally, make sure to have mdBook installed on your machine. Then, within the project root, execute:

```
mdbook serve
```

## App Frontend

A progressive web app.

### Deployment

The app is automatically deployed: [ABC DPT App](https://abc-dpt.netlify.app/)

### Local setup

#### Dependencies

Make sure to have [Node.js](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/lang/en/) installed on your machine.

Then, install the node dependencies:

```
$ yarn
```

#### Running the project for development

Run the app:

```
$ yarn start
```

#### API endpoint, Mock API

The API used by the app is documented in an OpenAPI spec at [docs/ABC-DPT.v1.yaml].

By default, API requests are mocked using [MSW](https://mswjs.io/). The behavior of the API client can be controlled using environment variables:

- `API_USE_MOCK`: Boolean whether API requests are mocked. Default: true
- `API_ROOT`: String of the API root without trailing slash, e.g. `"https://example.com/api"`. Default: `""`

API mocks are defined at `src/mocks/`.

### Technical overview

Entry point: `src/index.tsx`

Recommended editor setup:

- editorconfig
- prettier

Basic library choices:

- Language: [TypeScript](https://www.typescriptlang.org/)
- Module bundler: [webpack 5](https://webpack.js.org/) + [ts-loader](https://github.com/TypeStrong/ts-loader)
- Reactivity Framework: [React](https://reactjs.org/)
- Component Library: [Material-UI](https://material-ui.com/)
- Internationalization: [formatjs / react-intl](https://formatjs.io/)
- API mocking: [Mock Service Worker](https://mswjs.io/)

Architecture overview:

- The folder structure is based on the [Redux Feature-Folder Approach](https://redux.js.org/style-guide/style-guide#structure-files-as-feature-folders-with-single-file-logic)
- Folder structure is as follows:
  - `src/app/` - App-Wide setup that depends on all the other folders
    - `src/app/pages/` - App pages, i.e. index, camera, code, start, ...
  - `src/common/` - Generic, reusable components and utilities
    - `src/common/components/` - Generic, dumb React components
    - `src/common/hooks/` - Generic React hooks, API hooks based on `useSWR`
    - `src/common/icons/` - Additional icons that are not part of `@material-ui/icons`
    - `src/common/testing/` - Code only used for unit testing
    - `src/common/types` - Generic TypeScript types used throughout the app
  - `src/features/` - Folders that contain all functionality related to a specific feature
    - `src/features/code/` - Game code feature
    - `src/features/parameters/` - Game parameter feature
  - `src/mocks/` - Mock Service Worker setup and handlers

### Unit Tests

Every component and every module should have a basic unit tests. Unit tests are written using [Jest](https://jestjs.io/).

Tests are written as follows:

- React Components:
  - Create meaningful [Snapshot Tests](https://jestjs.io/docs/snapshot-testing)
  - Test behavior using [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/)
- React Hooks
  - Test behavior using [`@testing-library/react-hooks`](https://github.com/testing-library/react-hooks-testing-library)
- Hooks/Components that issue API requests:
  - Mock API requests using [Mock Service Worker](https://mswjs.io/)
- Simple functions
  - Unit test using [Jest `expect()`](https://jestjs.io/docs/expect)

To run all tests, execute:

```
yarn test
```

### Internationalization

For Internationalization, [formatjs / react-intl](https://formatjs.io/) is used. The workflow is as follows:

#### 1. Message Declaration

Declare messages _only_ using default message and description!

See [react-intl API Reference](https://formatjs.io/docs/react-intl) for a full documentation.

#### 2. Message Extraction

Run `yarn extract`. The file at `lang/de.json` is updated. On import, it is automatically precompiled using Webpack.

#### 3. Message Translation

Translate the messages inside `lang/de.json`. The messages are formatted using the ICU Message syntax.

See [Format.JS Message Syntax](https://formatjs.io/docs/core-concepts/icu-syntax) for a quick overview of what you can do.

See [ICU Formatting Messages Documentation](https://unicode-org.github.io/icu/userguide/format_parse/messages/) for a full reference.
