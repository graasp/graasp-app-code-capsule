# Code Capsule App

This repository hosts the code for a Graasp app that lets users write code reviews, edit and annotate code, alone or in collaboration.

## Installation

## Running the app

Create a `.env.development` file with the following content:

```
PORT=3005
CYPRESS_BASE_URL=http://localhost:3005

REACT_APP_GRAASP_APP_ID=1234-1234
REACT_APP_MOCK_API=true
REACT_APP_API_HOST=http://localhost:3636

REACT_APP_VERSION=$npm_package_version
```

## Running the tests (automatic run on commit with husky)

Create a `.env.test` file with the following content:

```
PORT=3333
CYPRESS_BASE_URL=http://localhost:3333
CYPRESS_INSTRUMENT_PRODUCTION=true

REACT_APP_GRAASP_APP_ID=1234-1234
REACT_APP_MOCK_API=true
REACT_APP_API_HOST=http://localhost:3636

BROWSER=none
```

## Documentation

### How to bootstrap your app and set every tool you need

Please have a look at the documentation to [start your app and setup all necessary tools](docs/SETUP.md).
