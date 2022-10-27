import { Context, PermissionLevel } from '@graasp/sdk';

import {
  PLAYER_VIEW_CYPRESS,
  buildDataCy,
} from '../../../../src/config/selectors';

describe('Read access', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: [] },
      appContext: {
        context: Context.BUILDER,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('show player view', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
  });
});
