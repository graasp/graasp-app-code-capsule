import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ANALYZER_VIEW_CYPRESS,
  buildDataCy,
} from '../../../src/config/selectors';

describe('Analyzer View', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: Context.ANALYTICS,
        permission: PermissionLevel.Admin,
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
