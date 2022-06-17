// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import '@cypress/code-coverage/support';

import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// ignore Resize Observer errors
// eslint-disable-next-line consistent-return
Cypress.on('uncaught:exception', (err) => {
  console.error(err.message);
  /* returning false here prevents Cypress from failing the test */
  if (/ResizeObserver/.test(err.message)) {
    return false;
  }
});
