import { MOCK_APP_DATA } from '../../../fixtures/appData';
import { CONTEXTS, PERMISSIONS } from '../../../../src/config/settings';
import {
  buildDataCy,
  PLAYER_VIEW_CYPRESS,
} from '../../../../src/config/selectors';

describe('Builder', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: MOCK_APP_DATA },
      appContext: {
        context: CONTEXTS.BUILDER,
        permission: PERMISSIONS.WRITE,
      },
    });
    cy.visit('/');
  });

  it('should show player view', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
  });
});
