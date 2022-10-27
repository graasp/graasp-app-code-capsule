import { Context, PermissionLevel } from '@graasp/sdk';

import {
  PLAYER_VIEW_CYPRESS,
  buildDataCy,
} from '../../../../src/config/selectors';
import { MOCK_APP_SETTINGS } from '../../../fixtures/appSettings';

describe('Show code', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: MOCK_APP_SETTINGS,
      },
      appContext: {
        context: Context.PLAYER,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('should show code review', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
  });
});
