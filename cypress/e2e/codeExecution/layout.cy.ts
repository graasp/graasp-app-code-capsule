import { Context, PermissionLevel } from '@graasp/sdk';

import {
  REPL_FULL_SCREEN_BUTTON_CY,
  REPL_SAVE_BUTTON_CY,
  buildDataCy,
} from '../../../src/config/selectors';
import { MOCK_CODE_EXECUTION_SETTINGS } from '../../fixtures/appSettings';

describe('Button Layout', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [MOCK_CODE_EXECUTION_SETTINGS],
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    });
    cy.visit('/');
  });

  it('Small Screen', () => {
    cy.viewport('iphone-x');
    cy.waitForReplReady();
    cy.get(buildDataCy(REPL_SAVE_BUTTON_CY)).should('not.contain.text', 'Save');
  });

  it('Large Screen', () => {
    cy.viewport('macbook-15');
    cy.waitForReplReady();
    cy.get(buildDataCy(REPL_SAVE_BUTTON_CY)).should('contain.text', 'Save');
  });

  it('FullScreen', () => {
    cy.get(buildDataCy(REPL_FULL_SCREEN_BUTTON_CY))
      .should('be.visible')
      .click();
  });
});
