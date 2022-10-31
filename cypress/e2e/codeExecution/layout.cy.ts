import { Context, PermissionLevel } from '@graasp/sdk';

import {
  REPLY_SAVE_BUTTON_CY,
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
        context: Context.PLAYER,
        permission: PermissionLevel.Write,
      },
    });
    cy.visit('/');
  });

  it.only('Small Screen', () => {
    cy.viewport('iphone-x');
    cy.waitForReplReady();
    cy.get(buildDataCy(REPLY_SAVE_BUTTON_CY)).should(
      'not.contain.text',
      'Save',
    );
  });

  it('Large Screen', () => {
    cy.viewport('macbook-15');
    cy.waitForReplReady();
    cy.get(buildDataCy(REPLY_SAVE_BUTTON_CY)).should('contain.text', 'Save');
  });
});
