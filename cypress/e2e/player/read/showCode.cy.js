import { CONTEXTS, PERMISSIONS } from '../../../../src/config/settings';
import { MOCK_APP_SETTINGS } from '../../../fixtures/appSettings';
import {
  buildDataCy,
  PLAYER_VIEW_CYPRESS,
} from '../../../../src/config/selectors';

describe('Show code', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: MOCK_APP_SETTINGS,
      },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.READ,
      },
    });
    cy.visit('/');
  });

  it('should show code review', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
  });
});
