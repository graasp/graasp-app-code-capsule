import { SINGLE_LINE_MOCK_COMMENTS } from '../../../fixtures/appData';
import { CONTEXTS, PERMISSIONS } from '../../../../src/config/settings';
import {
  buildDataCy,
  PLAYER_VIEW_CYPRESS,
} from '../../../../src/config/selectors';

describe('Builder', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: SINGLE_LINE_MOCK_COMMENTS },
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
