import {
  PLAYER_VIEW_CYPRESS,
  buildDataCy,
} from '../../../../src/config/selectors';
import { CONTEXTS, PERMISSIONS } from '../../../../src/config/settings';
import { SINGLE_LINE_MOCK_COMMENTS } from '../../../fixtures/appData';

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
