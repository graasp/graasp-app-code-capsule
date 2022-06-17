import { JAVASCRIPT } from '../../../../src/config/constants';
import {
  CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS,
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_LANGUAGE_SELECT_CYPRESS,
  PROGRAMMING_LANGUAGE_SELECT_CYPRESS,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DIALOG_WINDOW_CYPRESS,
  SETTINGS_FAB_CYPRESS,
  buildDataCy,
} from '../../../../src/config/selectors';
import {
  CONTEXTS,
  DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
  PERMISSIONS,
} from '../../../../src/config/settings';

describe('Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: CONTEXTS.BUILDER,
        permission: PERMISSIONS.ADMIN,
      },
    });

    cy.visit('/');
  });

  it('Open settings', () => {
    cy.get(buildDataCy(SETTINGS_FAB_CYPRESS))
      .should('be.visible')
      .as('settingsFab')
      .click();

    // check buttons are visible
    cy.get(buildDataCy(SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS)).should(
      'be.visible',
    );
    cy.get(buildDataCy(SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS))
      .as('saveButton')
      .should('be.visible');

    // check select (drop-down)
    cy.get(buildDataCy(CODE_EDITOR_LANGUAGE_SELECT_CYPRESS)).should(
      'be.visible',
    );
    cy.get(`${buildDataCy(CODE_EDITOR_LANGUAGE_SELECT_CYPRESS)} > input`).as(
      'select',
    );
    cy.get('@select').should(
      'have.value',
      DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
    );
    cy.get(buildDataCy(CODE_EDITOR_LANGUAGE_SELECT_CYPRESS)).click();
    cy.get(`ul > li[data-value="${JAVASCRIPT}"]`).click();
    cy.get('@select').should('have.value', JAVASCRIPT);

    // type in editor
    const testCode = `const greeting = 'Hello World';`;
    cy.get('.monaco-editor textarea:first')
      .click()
      .focused()
      .type(`{selectall}${testCode}`);

    // type a commit message
    const commitMessage = 'This is my commit message';
    const commitDescription =
      'My commitDescription will be long and\nhave a very long\ndescription';
    cy.get(buildDataCy(CODE_EDITOR_COMMIT_MESSAGE_CYPRESS))
      .should('be.visible')
      .type(commitMessage);
    cy.get(`${buildDataCy(CODE_EDITOR_COMMIT_MESSAGE_CYPRESS)} input`).should(
      'have.value',
      commitMessage,
    );
    cy.get(buildDataCy(CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS))
      .should('be.visible')
      .type(commitDescription);
    cy.get(
      `${buildDataCy(CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS)} textarea`,
    ).should('have.value', commitDescription);

    cy.get('@saveButton').click();
    cy.get(buildDataCy(SETTINGS_DIALOG_WINDOW_CYPRESS)).should(
      'not.be.visible',
    );

    // open settings
    cy.get('@settingsFab').click();
  });
});
