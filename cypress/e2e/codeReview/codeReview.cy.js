import { MOCK_APP_DATA } from '../../fixtures/appData';
import { CONTEXTS, PERMISSIONS } from '../../../src/config/settings';

describe('Code review', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: MOCK_APP_DATA },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.ADMIN,
      },
    });
    cy.visit('/');
  });
});
