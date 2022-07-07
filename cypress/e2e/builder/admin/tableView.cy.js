import { List } from 'immutable';

import { APP_DATA_TYPES } from '../../../../src/config/appDataTypes';
import {
  CUSTOM_DIALOG_TITLE_CYPRESS,
  ORPHAN_BUTTON_CYPRESS,
  TABLE_VIEW_BODY_USERS_CYPRESS,
  TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS,
  TABLE_VIEW_OPEN_REVIEW_BUTTON_CYPRESS,
  TABLE_VIEW_PANE_CYPRESS,
  TABLE_VIEW_REVIEW_DIALOG_CLOSE_BUTTON_CYPRESS,
  TABLE_VIEW_TABLE_CYPRESS,
  TABLE_VIEW_USERNAME_CELL_CYPRESS,
  TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS,
  TAB_TABLE_VIEW_CYPRESS,
  buildDataCy,
  buildTableRowCypress,
  tableRowUserCypress,
} from '../../../../src/config/selectors';
import { CONTEXTS, PERMISSIONS } from '../../../../src/config/settings';
import { getOrphans } from '../../../../src/utils/comments';
import {
  MOCK_ORPHAN_COMMENT,
  SINGLE_LINE_MOCK_COMMENTS,
} from '../../../fixtures/appData';
import { MOCK_CODE_SETTINGS } from '../../../fixtures/appSettings';
import { SLOW_DOWN_CYPRESS_DELAY } from '../../../fixtures/constants';

// importing a const from a file and using it in cy.wait() produces an error:
// https://github.com/cypress-io/eslint-plugin-cypress/issues/43#issuecomment-986675657
const waitingDelay = SLOW_DOWN_CYPRESS_DELAY;

describe('Builder with Admin access', () => {
  describe('Table view with orphans', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appData: [...SINGLE_LINE_MOCK_COMMENTS, MOCK_ORPHAN_COMMENT],
          appSettings: [MOCK_CODE_SETTINGS],
        },
        appContext: {
          context: CONTEXTS.BUILDER,
          permission: PERMISSIONS.ADMIN,
        },
      });
      cy.visit('/');
    });

    it('remove orphan comments', () => {
      cy.get(buildDataCy(TAB_TABLE_VIEW_CYPRESS)).should('be.visible').click();
      cy.get(buildDataCy(TABLE_VIEW_PANE_CYPRESS)).should('be.visible');

      // check that all users are displayed
      const comments = List(
        SINGLE_LINE_MOCK_COMMENTS.filter(
          (r) => r.type === APP_DATA_TYPES.COMMENT,
        ),
      );
      const orphansId = getOrphans(comments).map((c) => c.id);
      const nonOrphanComments = comments?.filter(
        (c) => !orphansId.includes(c.id),
      );
      const users = nonOrphanComments.map((r) => r.memberId);
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
          .children(buildDataCy(TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS))
          .should('contain.text', count);
      });
      cy.wait(waitingDelay);
      cy.get(buildDataCy(ORPHAN_BUTTON_CYPRESS)).should('exist').click();

      // number of displayed comments should not have changed
      Object.entries(userCounts).forEach(([memberId, count]) => {
        cy.get(buildTableRowCypress(tableRowUserCypress(memberId)))
          .children(buildDataCy(TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS))
          .should('contain.text', count);
      });
    });
  });

  describe('Student responses', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appData: SINGLE_LINE_MOCK_COMMENTS,
          appSettings: [MOCK_CODE_SETTINGS],
        },
        appContext: {
          context: CONTEXTS.BUILDER,
          permission: PERMISSIONS.ADMIN,
        },
      });
      cy.visit('/');
    });

    it('should open a student responses', () => {
      // select the first row in the users table
      cy.get(buildDataCy(TABLE_VIEW_BODY_USERS_CYPRESS)).children('tr').first();

      // get usernames in table
      cy.get(buildDataCy(TABLE_VIEW_USERNAME_CELL_CYPRESS)).as('usernames');

      // open every review and check that the names match
      cy.get(buildDataCy(TABLE_VIEW_OPEN_REVIEW_BUTTON_CYPRESS)).each(
        (el, idx) => {
          let contentText;
          cy.get('@usernames')
            .eq(idx)
            .invoke('prop', 'innerText')
            .then((userElem) => {
              contentText = userElem;
            })
            .then(() => {
              cy.wrap(el).click();
              cy.get(buildDataCy(TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS)).should(
                'be.visible',
              );
              cy.get(
                `${buildDataCy(
                  TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS,
                )} ${buildDataCy(CUSTOM_DIALOG_TITLE_CYPRESS)}`,
              ).should('contain.text', contentText);

              // close the dialog
              cy.get(
                buildDataCy(TABLE_VIEW_REVIEW_DIALOG_CLOSE_BUTTON_CYPRESS),
              ).click();
            });
        },
      );

      // check that the dialog is open
      cy.get(buildDataCy(TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS)).should(
        'be.visible',
      );
    });
  });
});
