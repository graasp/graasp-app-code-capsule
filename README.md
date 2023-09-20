# Code Capsule App

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

This repository hosts the code for a Graasp app that lets users write code reviews, edit and annotate code, alone or in collaboration.

## Installation

## Running the app

Create a `.env.development` file with the following content:

```bash
VITE_PORT=3005
VITE_API_HOST=http://localhost:3000
VITE_MOCK_API=true
VITE_GRAASP_APP_KEY=45678-677889
VITE_VERSION=latest

VITE_OPEN_AI_API_URL=http://localhost:1234
```

Launch the app with `yarn dev`.

## Running the tests (automatic run on commit with husky)

Create a `.env.test` file with the following content:

```bash
VITE_PORT=3333
VITE_API_HOST=http://localhost:3000
VITE_MOCK_API=true
VITE_GRAASP_APP_KEY=45678-677889
VITE_VERSION=latest

# dont open browser
BROWSER=none

VITE_OPEN_AI_API_URL=http://localhost:1234
```

Start the tests with `yarn test` for automatic start of the dev server as well as cypress (similar to the CI run).
Or open 2 terminals and execute `yarn dev` in one and `yarn cypress:open` in the other.
This will open the Cypress GUI app in which you can run individual tests and interact with the app in it's testing environnement.

## Documentation

### How to bootstrap your app and set every tool you need

Please have a look at the documentation to [start your app and setup all necessary tools](docs/SETUP.md).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/spaenleh"><img src="https://avatars.githubusercontent.com/u/39373170?v=4?s=100" width="100px;" alt="Basile Spaenlehauer"/><br /><sub><b>Basile Spaenlehauer</b></sub></a><br /><a href="https://github.com/graasp/graasp-app-code-capsule/commits?author=spaenleh" title="Code">💻</a> <a href="#ideas-spaenleh" title="Ideas, Planning, & Feedback">🤔</a> <a href="#research-spaenleh" title="Research">🔬</a> <a href="https://github.com/graasp/graasp-app-code-capsule/commits?author=spaenleh" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
