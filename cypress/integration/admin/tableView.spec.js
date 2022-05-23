import { MOCK_APP_DATA } from '../../fixtures/appData';
import { CONTEXTS, PERMISSIONS } from '../../../src/config/settings';
import {
  buildDataCy,
  buildTableRowCypress,
  NUMBER_OF_COMMENTS_CYPRESS,
  PLAYER_VIEW_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
  TABLE_NO_COMMENTS_CYPRESS,
  TABLE_VIEW_BODY_USERS_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
  TABLE_VIEW_TABLE_CYPRESS,
  tableRowUserCypress,
} from '../../../src/config/selectors';
import { APP_DATA_TYPES } from '../../../src/config/appDataTypes';

describe('Builder', () => {
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

  describe('Write access', () => {
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

  describe('Admin access', () => {
    it('should show table view', () => {
      cy.setUpApi({
        database: { appData: MOCK_APP_DATA },
        appContext: {
          context: CONTEXTS.BUILDER,
          permission: PERMISSIONS.ADMIN,
        },
      });
      cy.visit('/');

      cy.get(buildDataCy(TAB_TABLE_VIEW_CYPRESS)).should('be.visible').click();
      cy.get(buildDataCy(TABLE_VIEW_PANE_CYPRESS)).should('be.visible');

      // check that all users are displayed
      const comments = MOCK_APP_DATA.filter(
        (r) => r.type === APP_DATA_TYPES.COMMENT,
      );
      const users = comments.map((r) => r.memberId);
      const userCounts = users.reduce((acc, user) => {
        acc[user] = acc[user] ? acc[user] + 1 : 1;
        return acc;
      }, {});

      cy.get(buildDataCy(TABLE_VIEW_TABLE_CYPRESS)).should('be.visible');
      cy.get(buildDataCy(TABLE_VIEW_BODY_USERS_CYPRESS))
        .children('tr')
        .should('have.length', Object.keys(userCounts).length);
      Object.entries(userCounts).forEach(([memberId, count]) => {
        cy.get(buildTableRowCypress(tableRowUserCypress(memberId)))
          .children(buildDataCy(NUMBER_OF_COMMENTS_CYPRESS))
          .should('contain.text', count);
      });
    });

    it('should show empty table view', () => {
      cy.setUpApi({
        database: { appData: [] },
        appContext: {
          context: CONTEXTS.BUILDER,
          permission: PERMISSIONS.ADMIN,
        },
      });
      cy.visit('/');

      cy.get(buildDataCy(TAB_TABLE_VIEW_CYPRESS)).should('be.visible').click();
      cy.get(buildDataCy(TABLE_VIEW_PANE_CYPRESS)).should('be.visible');
      cy.get(buildDataCy(TABLE_VIEW_TABLE_CYPRESS)).should('be.visible');
      // check that the 'No comments' row is present
      cy.get(buildDataCy(TABLE_NO_COMMENTS_CYPRESS)).should('be.visible');
    });
  });
});
