import { Context, PermissionLevel } from '@graasp/sdk';

import { ANALYTICS_VIEW_CY, buildDataCy } from '../../../src/config/selectors';

describe('Analytics View', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: Context.Analytics,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');
  });

  it('should open Analytics view', () => {
    cy.get(buildDataCy(ANALYTICS_VIEW_CY), { timeout: 10000 })
      .should('be.visible')
      .and('have.text', 'Analytics View');
  });
});
