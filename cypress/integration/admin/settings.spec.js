import {
  buildDataCy,
  PROGRAMMING_LANGUAGE_SELECT_CYPRESS,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DIALOG_WINDOW_CYPRESS,
  SETTINGS_FAB_CYPRESS,
} from '../../../src/config/selectors';
import { CONTEXTS, PERMISSIONS } from '../../../src/config/settings';
import { DEFAULT_PROGRAMMING_LANGUAGE_SETTING } from '../../../src/interfaces/settings';
import { JAVASCRIPT } from '../../../src/config/constants';

describe('Settings', () => {
  it('Open settings', () => {
    cy.setUpApi({
      database: { appSettings: [] },
      appContext: {
        context: CONTEXTS.BUILDER,
        permission: PERMISSIONS.ADMIN,
      },
    });

    cy.visit('/');
    cy.get(buildDataCy(SETTINGS_FAB_CYPRESS)).should('be.visible').click();

    // check buttons are visible
    cy.get(buildDataCy(SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS)).should(
      'be.visible',
    );
    cy.get(buildDataCy(SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS))
      .as('saveButton')
      .should('be.visible');

    // check select (drop-down)
    cy.get(buildDataCy(PROGRAMMING_LANGUAGE_SELECT_CYPRESS)).should(
      'be.visible',
    );
    cy.get(`${buildDataCy(PROGRAMMING_LANGUAGE_SELECT_CYPRESS)} > input`).as(
      'select',
    );
    cy.get('@select').should(
      'have.value',
      DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
    );
    cy.get(buildDataCy(PROGRAMMING_LANGUAGE_SELECT_CYPRESS)).click();
    cy.get(`ul > li[data-value="${JAVASCRIPT}"]`).click();
    cy.get('@select').should('have.value', JAVASCRIPT);

    // type in editor
    const testCode = `const greeting = 'Hello World';`;
    cy.get('.monaco-editor textarea:first')
      .click()
      .focused()
      .type(`{selectall}${testCode}`);

    cy.get('@saveButton').click();
    cy.get(buildDataCy(SETTINGS_DIALOG_WINDOW_CYPRESS)).should(
      'not.be.visible',
    );
  });
});
