import { Context, PermissionLevel } from '@graasp/sdk';

import {
  TABLE_NO_COMMENTS_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
  TABLE_VIEW_TABLE_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
  buildDataCy,
} from '../../../../src/config/selectors';

describe('Builder with Admin access', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: [] },
      appContext: {
        context: Context.BUILDER,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');
  });
  it('should show empty table view', () => {
    cy.get(buildDataCy(TAB_TABLE_VIEW_CYPRESS)).should('be.visible').click();
    cy.get(buildDataCy(TABLE_VIEW_PANE_CYPRESS)).should('be.visible');
    cy.get(buildDataCy(TABLE_VIEW_TABLE_CYPRESS)).should('be.visible');
    // check that the 'No comments' row is present
    cy.get(buildDataCy(TABLE_NO_COMMENTS_CYPRESS)).should('be.visible');
  });
});
