import { Context, PermissionLevel } from '@graasp/sdk';

import { REVIEW_MODE_COLLABORATIVE } from '../../../src/config/constants';
import {
  ALLOW_COMMENTS_SWITCH_CYPRESS,
  ALLOW_REPLIES_SWITCH_CYPRESS,
  APP_MODE_EXECUTE_BUTTON_CY,
  APP_MODE_REVIEW_BUTTON_CY,
  CUSTOM_DIALOG_CONTENT_CY,
  DISPLAY_SETTINGS_FAB_CYPRESS,
  EXECUTION_MODE_SETTINGS_KEY,
  REVIEW_MODES_SELECT_CYPRESS,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS,
  SETTING_ADD_CHATBOT_PROMPT_CY,
  SETTING_APP_MODE_SELECT_NAME_CY,
  SETTING_CHATBOT_INITIAL_PROMPT_DISPLAY_CY,
  SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY,
  SETTING_CHATBOT_PROMPT_DISPLAY_CY,
  SETTING_CHATBOT_PROMPT_LINE_DISPLAY_CY,
  SETTING_CHATBOT_PROMPT_LINE_NUMBER_CY,
  SETTING_EDIT_CHATBOT_PROMPT_CY,
  SETTING_FOOTER_CODE_EDITOR_CY,
  SETTING_HEADER_CODE_EDITOR_CY,
  SETTING_INITIAL_PROMPT_CODE_EDITOR_CY,
  SETTING_MAIN_CODE_EDITOR_CY,
  SETTING_MAX_COMMENT_LENGTH,
  SETTING_NEW_CHATBOT_PROMPT_KEY,
  TAB_SETTINGS_VIEW_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
  buildDataCy,
  settingKeyDataCy,
} from '../../../src/config/selectors';
import { DEFAULT_REVIEW_MODE_SETTING } from '../../../src/config/settings';

describe('Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: Context.Builder,
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
    const c1 = `print('hello world')`;
    const newHeaderContent = `${c1}\n# this is the end of the header code`;
    cy.typeInEditor(newHeaderContent, SETTING_HEADER_CODE_EDITOR_CY);
    // set the footer code
    const f1 = `# beginning of the footer code`;
    cy.typeInEditor(`${f1}\nprint('Goodbye')`, SETTING_FOOTER_CODE_EDITOR_CY);

    cy.get(
      `#${settingKeyDataCy(EXECUTION_MODE_SETTINGS_KEY)} > ${buildDataCy(
        SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
      )}`,
    ).click();

    // go back to table view and check data stayed in setting view
    cy.openTab(TAB_TABLE_VIEW_CYPRESS);
    // open the settings tab
    cy.openTab(TAB_SETTINGS_VIEW_CYPRESS);

    cy.expectContentInEditor(c1, SETTING_HEADER_CODE_EDITOR_CY);

    cy.expectContentInEditor(f1, SETTING_FOOTER_CODE_EDITOR_CY);
  });

  it.only('Change code review settings in tab', () => {
    const initialChatbotPrompt = 'Initial prompt hello chatbot';
    const chatbotPrompt = 'Hello i  am a friendly chatbot, ask me anything';
    const promptLine = 4;

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
      initialChatbotPrompt,
      SETTING_INITIAL_PROMPT_CODE_EDITOR_CY,
    );

    cy.typeInEditor(chatbotPrompt, SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY);
    cy.get(buildDataCy(SETTING_CHATBOT_PROMPT_LINE_NUMBER_CY)).type(
      `{selectAll}{del}${promptLine}`,
    );

    cy.get(
      `#${settingKeyDataCy(SETTING_NEW_CHATBOT_PROMPT_KEY)} > ${buildDataCy(
        SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
      )}`,
    ).click();
    // check the displayed values for the chatbot prompt after editing
    cy.get(buildDataCy(SETTING_CHATBOT_INITIAL_PROMPT_DISPLAY_CY)).should(
      'contain.text',
      initialChatbotPrompt,
    );
    cy.get(buildDataCy(SETTING_CHATBOT_PROMPT_DISPLAY_CY)).should(
      'contain.text',
      chatbotPrompt,
    );
    cy.get(buildDataCy(SETTING_CHATBOT_PROMPT_LINE_DISPLAY_CY)).should(
      'contain.text',
      promptLine,
    );

    // update chatbot prompt settings
    cy.get(buildDataCy(SETTING_EDIT_CHATBOT_PROMPT_CY)).click();

    cy.get(buildDataCy(CUSTOM_DIALOG_CONTENT_CY)).should('be.visible');

    cy.typeInEditor('!', SETTING_INITIAL_PROMPT_CODE_EDITOR_CY);
    // check that the other editor is not empty
    cy.get(`#${SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY}`).should(
      'contain.text',
      chatbotPrompt,
    );

    cy.get(
      `#${settingKeyDataCy(SETTING_NEW_CHATBOT_PROMPT_KEY)} > ${buildDataCy(
        SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
      )}`,
    ).click();

    // check the displayed values for the chatbot prompt after editing
    cy.get(buildDataCy(SETTING_CHATBOT_INITIAL_PROMPT_DISPLAY_CY)).should(
      'contain.text',
      '!',
    );
    cy.get(buildDataCy(SETTING_CHATBOT_PROMPT_DISPLAY_CY)).should(
      'contain.text',
      chatbotPrompt,
    );
    cy.get(buildDataCy(SETTING_CHATBOT_PROMPT_LINE_DISPLAY_CY)).should(
      'contain.text',
      promptLine,
    );
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
