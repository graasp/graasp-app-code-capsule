import { CONTEXTS, PERMISSIONS } from '../../../src/config/settings';
import {
  buildDataCy,
  PLAYER_VIEW_CYPRESS,
} from '../../../src/config/selectors';

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
