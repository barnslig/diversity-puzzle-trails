# ABC Diversity Puzzle Trails

This is the monorepo for the ABC Diversity Puzzle Trails Companion App.

Issue overview: [Project Board](https://github.com/barnslig/diversity-puzzle-trails/projects/1)

[[_TOC_]]

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

Run the app with a self-signed ssl certificate in order to use the camera:

```
$ yarn start --https
```

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

Architecture overview:

- The folder structure is based on the [Redux Feature-Folder Approach](https://redux.js.org/style-guide/style-guide#structure-files-as-feature-folders-with-single-file-logic)
- Folder structure is as follows:
  - `src/app/` - App-Wide setup that depends on all the other folders
  - `src/common/` - Generic, reusable components and utilities
  - `src/features/` - Folders that contain all functionality related to a specific feature
    - `src/features/parameters/` - Game parameter feature
    - `src/features/messages/` - Messages feature
    - ...

### Unit Tests

Every component and every module should have a basic unit tests. Unit tests are written using [Jest](https://jestjs.io/).

Tests are written as follows:

- React Components: [Snapshot Test](https://jestjs.io/docs/snapshot-testing) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for functionality testing

To run the tests, execute:

```
yarn test
```

### Internationalization

TODO This section should cover the process of internationalization message declaration/extraction/translation
