import { Context, PermissionLevel } from '@graasp/sdk';

import {
  REPL_CONTAINER_CY,
  REPL_OUTPUT_CONSOLE_CY,
  REPL_RUN_CODE_BUTTON_CY,
  buildDataCy,
} from '../../../src/config/selectors';
import {
  CODE_EXECUTION_MODE_SETTING,
  MOCK_CODE_EXECUTION_SETTINGS,
} from '../../fixtures/appSettings';

describe('Display Code Execution', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          MOCK_CODE_EXECUTION_SETTINGS,
          CODE_EXECUTION_MODE_SETTING,
        ],
      },
      appContext: {
        context: Context.PLAYER,
        permission: PermissionLevel.Write,
      },
    });
    cy.visit('/');
  });

  it('displays the interface', { defaultCommandTimeout: 180000 }, () => {
    cy.get(buildDataCy(REPL_CONTAINER_CY));
    cy.get(buildDataCy(REPL_RUN_CODE_BUTTON_CY))
      .should('not.be.disabled')
      .click();
    cy.get(buildDataCy(REPL_OUTPUT_CONSOLE_CY)).should(
      'contain.text',
      'Hello World',
    );
  });
});
