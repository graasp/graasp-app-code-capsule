import {
  PLAYER_VIEW_CYPRESS,
  buildDataCy,
} from '../../../../src/config/selectors';
import { CONTEXTS, PERMISSIONS } from '../../../../src/config/settings';

describe('Read access', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: [] },
      appContext: {
        context: CONTEXTS.BUILDER,
        permission: PERMISSIONS.READ,
      },
    });
    cy.visit('/');
  });

  it('show player view', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
  });
});
