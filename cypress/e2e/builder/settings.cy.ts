import {
  JAVASCRIPT,
  REVIEW_MODE_COLLABORATIVE,
} from '../../../src/config/constants';
import {
  ALLOW_COMMENTS_SWITCH_CYPRESS,
  ALLOW_REPLIES_SWITCH_CYPRESS,
  CODE_EDITOR_CANCEL_BUTTON_CYPRESS,
  CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS,
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_LANGUAGE_SELECT_CYPRESS,
  CODE_EDITOR_SUBMIT_BUTTON_CYPRESS,
  CODE_SETTINGS_FAB_CYPRESS,
  DISPLAY_SETTINGS_FAB_CYPRESS,
  REVIEW_MODES_SELECT_CYPRESS,
  SETTINGS_CODE_DIALOG_WINDOW_CYPRESS,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS,
  buildDataCy,
} from '../../../src/config/selectors';
import {
  CONTEXTS,
  DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
  DEFAULT_REVIEW_MODE_SETTING,
  PERMISSIONS,
} from '../../../src/config/settings';

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

  it.only('Open Code settings', () => {
    // click on the code settings FAB
    cy.get(buildDataCy(CODE_SETTINGS_FAB_CYPRESS))
      .should('be.visible')
      .as('codeSettingsFab')
      .click();

    // check buttons are visible
    cy.get(buildDataCy(CODE_EDITOR_CANCEL_BUTTON_CYPRESS)).should('be.visible');
    cy.get(buildDataCy(CODE_EDITOR_SUBMIT_BUTTON_CYPRESS))
      .as('saveButton')
      .should('be.visible');

    // check select (drop-down)
    cy.get(buildDataCy(CODE_EDITOR_LANGUAGE_SELECT_CYPRESS)).should(
      'be.visible',
    );
    cy.get(`${buildDataCy(CODE_EDITOR_LANGUAGE_SELECT_CYPRESS)} > input`).as(
      'select',
    );
    // check initial value of programming language select
    cy.get('@select').should(
      'have.value',
      DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
    );
    cy.get(buildDataCy(CODE_EDITOR_LANGUAGE_SELECT_CYPRESS)).click();
    cy.get(`ul > li[data-value="${JAVASCRIPT}"]`).click();
    cy.get('@select').should('have.value', JAVASCRIPT);

    // type in editor
    const testCode = `const greeting = 'Hello World';{enter}// Wow !{enter}{enter}`;
    cy.typeInEditor(testCode);

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
    cy.get(buildDataCy(SETTINGS_CODE_DIALOG_WINDOW_CYPRESS)).should(
      'not.be.visible',
    );

    // open settings
    cy.get('@codeSettingsFab').click();
  });

  it('Open Display settings', () => {
    cy.get(buildDataCy(DISPLAY_SETTINGS_FAB_CYPRESS))
      .should('be.visible')
      .as('displaySettingsFab')
      .click();

    // check buttons are visible
    cy.get(buildDataCy(SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS)).should(
      'be.visible',
    );
    cy.get(buildDataCy(SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS))
      .as('saveButton')
      .should('be.visible');

    // check select (drop-down)
    cy.get(buildDataCy(REVIEW_MODES_SELECT_CYPRESS)).should('be.visible');
    cy.get(`${buildDataCy(REVIEW_MODES_SELECT_CYPRESS)} > input`).as('select');
    cy.get('@select').should('have.value', DEFAULT_REVIEW_MODE_SETTING);
    cy.get(buildDataCy(REVIEW_MODES_SELECT_CYPRESS)).click();
    cy.get(`ul > li[data-value="${REVIEW_MODE_COLLABORATIVE}"]`).click();
    cy.get('@select').should('have.value', REVIEW_MODE_COLLABORATIVE);

    // switches
    cy.get(buildDataCy(ALLOW_REPLIES_SWITCH_CYPRESS))
      .should('be.visible')
      .click()
      .click();
    cy.get(buildDataCy(ALLOW_COMMENTS_SWITCH_CYPRESS))
      .should('be.visible')
      .click()
      .click();

    cy.get('@saveButton').click();
    cy.get(buildDataCy(SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS)).should(
      'not.be.visible',
    );

    // open settings
    cy.get('@displaySettingsFab').click();
  });
});
