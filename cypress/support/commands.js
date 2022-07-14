import '@testing-library/cypress/add-commands';

import {
  CODE_EDITOR_CYPRESS,
  TOOLBAR_EDIT_CODE_BUTTON_CYPRESS,
  buildDataCy,
} from '../../src/config/selectors';
import { MOCK_SERVER_API_HOST, MOCK_SERVER_ITEM } from '../fixtures/appData';
import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add(
  'setUpApi',
  ({ currentMember = CURRENT_MEMBER, database = {}, appContext } = {}) => {
    // mock api and database
    Cypress.on('window:before:load', (win) => {
      // eslint-disable-next-line no-param-reassign
      win.database = {
        currentMember,
        currentItemId: MOCK_SERVER_ITEM.id,
        members: Object.values(MEMBERS),
        ...database,
      };
      // eslint-disable-next-line no-param-reassign
      win.appContext = {
        memberId: currentMember.id,
        itemId: MOCK_SERVER_ITEM.id,
        apiHost: Cypress.env('REACT_APP_API_HOST') || MOCK_SERVER_API_HOST,
        ...appContext,
      };
    });
  },
);

Cypress.Commands.add('openCodeEditor', () =>
  cy.get(buildDataCy(TOOLBAR_EDIT_CODE_BUTTON_CYPRESS)).click(),
);

Cypress.Commands.add('typeInEditor', (content) =>
  cy
    .get(CODE_EDITOR_CYPRESS)
    .click()
    .focused()
    .type(`{selectAll}{backspace}{selectAll}{backspace}${content}`),
);
