import { PyodideStatus } from '@graasp/pyodide';
import { Context, PermissionLevel } from '@graasp/sdk';

import {
  REPLY_SAVE_BUTTON_CY,
  REPL_CONTAINER_CY,
  REPL_EDITOR_ID_CY,
  REPL_OUTPUT_CONSOLE_CY,
  REPL_STATUS_INDICATOR_CY,
  buildDataCy,
} from '../../../src/config/selectors';
import {
  CODE_EXECUTION_MODE_SETTING,
  FOOTER_CODE_MESSAGE,
  HEADER_CODE_MESSAGE,
  MOCK_CODE_EXECUTION_SETTINGS,
} from '../../fixtures/appSettings';
import { REPL_TIMEOUT } from '../../fixtures/constants';

describe('Display Code Execution', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          CODE_EXECUTION_MODE_SETTING,
          MOCK_CODE_EXECUTION_SETTINGS,
        ],
      },
      appContext: {
        context: Context.PLAYER,
        permission: PermissionLevel.Write,
      },
    });
    cy.visit('/');
  });

  it('Header and footer code', () => {
    cy.get(buildDataCy(REPL_CONTAINER_CY));
    cy.waitForReplReady().click();
    cy.get(buildDataCy(REPL_OUTPUT_CONSOLE_CY), { timeout: REPL_TIMEOUT })
      .should('contain.text', HEADER_CODE_MESSAGE)
      .and('contain.text', FOOTER_CODE_MESSAGE);
  });

  it('Ask for input', () => {
    // wait until the editor is ready
    cy.waitForReplReady();
    // type some student code into the editor
    cy.typeInEditor(
      `age = input('What is your age?')\nprint('You are {}'.format(age))`,
      REPL_EDITOR_ID_CY,
    );
    // execute code
    cy.runRepl();

    // check that the text is displayed
    cy.get(buildDataCy(REPL_OUTPUT_CONSOLE_CY), {
      timeout: REPL_TIMEOUT,
    }).should('contain.text', 'What is your age?');
    cy.get(buildDataCy(REPL_STATUS_INDICATOR_CY)).should(
      'have.text',
      PyodideStatus.WAIT_INPUT,
    );

    // enter a response in the output console
    cy.get(buildDataCy(REPL_OUTPUT_CONSOLE_CY)).type('43{enter}');
    cy.get(buildDataCy(REPL_OUTPUT_CONSOLE_CY)).should(
      'contain.text',
      'You are 43',
    );
  });

  it('Saves Code into appData', () => {
    cy.waitForReplReady();
    cy.typeInEditor('# Save to App Data', REPL_EDITOR_ID_CY);
    cy.get(buildDataCy(REPLY_SAVE_BUTTON_CY)).should('be.visible').click();
  });
});
