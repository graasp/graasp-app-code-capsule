import { Context, PermissionLevel } from '@graasp/sdk';

import {
  PLAYER_VIEW_CYPRESS,
  buildDataCy,
} from '../../../../src/config/selectors';
import { SINGLE_LINE_MOCK_COMMENTS } from '../../../fixtures/appData';

describe('Builder', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: SINGLE_LINE_MOCK_COMMENTS },
      appContext: {
        context: Context.BUILDER,
        permission: PermissionLevel.Write,
      },
    });
    cy.visit('/');
  });

  it('should show player view', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
  });
});
