# Code Capsule App
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

This repository hosts the code for a Graasp app that lets users write code reviews, edit and annotate code, alone or in collaboration.

## Installation

## Running the app

Create a `.env.development` file with the following content:

```bash
PORT=3005
CYPRESS_BASE_URL=http://localhost:3005

REACT_APP_GRAASP_APP_ID=1234-1234
REACT_APP_MOCK_API=true
REACT_APP_API_HOST=http://localhost:3636

REACT_APP_VERSION=$npm_package_version

REACT_APP_OPEN_AI_API_URL=<url of the api>
```

## Running the tests (automatic run on commit with husky)

Create a `.env.test` file with the following content:

```bash
PORT=3333
CYPRESS_BASE_URL=http://localhost:3333
CYPRESS_INSTRUMENT_PRODUCTION=true

REACT_APP_GRAASP_APP_ID=1234-1234
REACT_APP_MOCK_API=true
REACT_APP_API_HOST=http://localhost:3636

REACT_APP_OPEN_AI_API_URL=<url of the api>

BROWSER=none
```

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
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/spaenleh"><img src="https://avatars.githubusercontent.com/u/39373170?v=4?s=100" width="100px;" alt="Basile Spaenlehauer"/><br /><sub><b>Basile Spaenlehauer</b></sub></a><br /><a href="https://github.com/graasp/graasp-app-code-capsule/commits?author=spaenleh" title="Code">💻</a> <a href="#ideas-spaenleh" title="Ideas, Planning, & Feedback">🤔</a> <a href="#research-spaenleh" title="Research">🔬</a> <a href="https://github.com/graasp/graasp-app-code-capsule/commits?author=spaenleh" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://juancarlosfarah.com"><img src="https://avatars.githubusercontent.com/u/1707188?v=4?s=100" width="100px;" alt="Juan Carlos Farah"/><br /><sub><b>Juan Carlos Farah</b></sub></a><br /><a href="#userTesting-juancarlosfarah" title="User Testing">📓</a> <a href="https://github.com/graasp/graasp-app-code-capsule/issues?q=author%3Ajuancarlosfarah" title="Bug reports">🐛</a> <a href="#research-juancarlosfarah" title="Research">🔬</a> <a href="#ideas-juancarlosfarah" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
