import { Context, PermissionLevel } from '@graasp/sdk';

import { REVIEW_MODE_COLLABORATIVE } from '../../../src/config/constants';
import { JAVASCRIPT } from '../../../src/config/programmingLanguages';
import {
  ALLOW_COMMENTS_SWITCH_CYPRESS,
  ALLOW_REPLIES_SWITCH_CYPRESS,
  APP_MODE_EXECUTE_BUTTON_CY,
  APP_MODE_REVIEW_BUTTON_CY,
  CODE_EDITOR_CANCEL_BUTTON_CYPRESS,
  CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS,
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_LANGUAGE_SELECT_CYPRESS,
  CODE_EDITOR_SUBMIT_BUTTON_CYPRESS,
  CODE_SETTINGS_FAB_CYPRESS,
  CUSTOM_DIALOG_CONTENT_CY,
  DISPLAY_SETTINGS_FAB_CYPRESS,
  REVIEW_MODES_SELECT_CYPRESS,
  SETTINGS_CODE_DIALOG_WINDOW_CYPRESS,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS,
  SETTING_ADD_CHATBOT_PROMPT_CY,
  SETTING_APP_MODE_SELECT_NAME_CY,
  SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY,
  SETTING_CHATBOT_PROMPT_LINE_NUMBER_CY,
  SETTING_FOOTER_CODE_EDITOR_CY,
  SETTING_HEADER_CODE_EDITOR_CY,
  SETTING_INITIAL_PROMPT_CODE_EDITOR_CY,
  SETTING_MAIN_CODE_EDITOR_CY,
  SETTING_MAX_COMMENT_LENGTH,
  SETTING_NEW_CHATBOT_PROMPT_KEY,
  TAB_SETTINGS_VIEW_CYPRESS,
  buildDataCy,
  settingKeyDataCy,
} from '../../../src/config/selectors';
import {
  DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
  DEFAULT_REVIEW_MODE_SETTING,
} from '../../../src/config/settings';

describe('Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: Context.BUILDER,
        permission: PermissionLevel.Admin,
      },
    });

    cy.visit('/');
  });

  it('Change code execution settings in tab', () => {
    // open the settings tab
    cy.openTab(TAB_SETTINGS_VIEW_CYPRESS);

    // choose a mode
    cy.get(buildDataCy(SETTING_APP_MODE_SELECT_NAME_CY)).click();
    cy.get(buildDataCy(APP_MODE_EXECUTE_BUTTON_CY))
      .should('be.visible')
      .click();

    cy.get(`#${SETTING_HEADER_CODE_EDITOR_CY}`).should('be.visible');
    cy.get(`#${SETTING_FOOTER_CODE_EDITOR_CY}`).should('be.visible');

    // set the header code
    cy.typeInEditor(
      `print('hello world')\n# this is the end of the header code`,
      SETTING_HEADER_CODE_EDITOR_CY,
    );
    // set the footer code
    cy.typeInEditor(
      `# beginning of the footer code\nprint('Goodbye')`,
      SETTING_FOOTER_CODE_EDITOR_CY,
    );
  });

  it('Change code review settings in tab', () => {
    // open the settings tab
    cy.openTab(TAB_SETTINGS_VIEW_CYPRESS);

    // choose a mode
    cy.get(buildDataCy(SETTING_APP_MODE_SELECT_NAME_CY)).click();
    cy.get(buildDataCy(APP_MODE_REVIEW_BUTTON_CY)).should('be.visible').click();

    cy.get(`#${SETTING_MAIN_CODE_EDITOR_CY}`).should('be.visible');
    // set the main code to review
    cy.typeInEditor(
      `print('hello world')\n# this is the end of the main code`,
      SETTING_MAIN_CODE_EDITOR_CY,
    );

    // add a chatbot prompt
    cy.get(buildDataCy(SETTING_ADD_CHATBOT_PROMPT_CY)).click();

    cy.get(buildDataCy(CUSTOM_DIALOG_CONTENT_CY)).should('be.visible');

    cy.typeInEditor(
      'Initial prompt hello chatbot',
      SETTING_INITIAL_PROMPT_CODE_EDITOR_CY,
    );

    cy.typeInEditor(
      'Hello i  am a friendly chatbot, ask me anything',
      SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY,
    );
    cy.get(buildDataCy(SETTING_CHATBOT_PROMPT_LINE_NUMBER_CY)).type(
      '{selectAll}{del}4',
    );

    cy.get(
      `#${settingKeyDataCy(SETTING_NEW_CHATBOT_PROMPT_KEY)} > ${buildDataCy(
        SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
      )}`,
    ).click();
  });

  it.skip('Open Code settings', () => {
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

    // change the max length of comments
    cy.get(`#${SETTING_MAX_COMMENT_LENGTH}`).should('be.visible').type('340');

    cy.get('@saveButton').click();
    cy.get(buildDataCy(SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS)).should(
      'not.be.visible',
    );

    // open settings
    cy.get('@displaySettingsFab').click();
  });
});
