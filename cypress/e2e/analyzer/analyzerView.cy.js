import { CONTEXTS, PERMISSIONS } from '../../../src/config/settings';
import {
  ANALYZER_VIEW_CYPRESS,
  buildDataCy,
} from '../../../src/config/selectors';

describe('Analyzer View', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: CONTEXTS.ANALYZER,
        permission: PERMISSIONS.ADMIN,
      },
    });
    cy.visit('/');
  });

  it('should open Analyzer view', () => {
    cy.get(buildDataCy(ANALYZER_VIEW_CYPRESS))
      .should('be.visible')
      .and('contain.text', 'Analyzer View');
  });
});
