import { Context, PermissionLevel } from '@graasp/sdk';

import {
  DIFF_VIEW_CONTAINER_CY,
  buildDataCy,
} from '../../../src/config/selectors';
import {
  CODE_EXPLAIN_MODE_SETTING,
  MOCK_DIFF_VIEW_SETTINGS,
} from '../../fixtures/appSettings';

describe('Diff View', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [CODE_EXPLAIN_MODE_SETTING, MOCK_DIFF_VIEW_SETTINGS],
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('show diff view', () => {
    cy.get(buildDataCy(DIFF_VIEW_CONTAINER_CY)).should('be.visible');
  });
});
