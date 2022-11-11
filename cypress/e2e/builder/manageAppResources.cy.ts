import { List } from 'immutable';
import countBy from 'lodash.countby';

import { Context, PermissionLevel } from '@graasp/sdk';

import { APP_DATA_TYPES } from '../../../src/config/appDataTypes';
import {
  CODE_REVIEW_CONTAINER_CYPRESS,
  CUSTOM_DIALOG_CONTENT_CY,
  CUSTOM_DIALOG_TITLE_CYPRESS,
  DOWNLOAD_ACTIONS_BUTTON_CY,
  ORPHAN_BUTTON_CYPRESS,
  PLAYER_VIEW_CYPRESS,
  TABLE_NO_COMMENTS_CYPRESS,
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
} from '../../../src/config/selectors';
import { CommentType } from '../../../src/interfaces/comment';
import { getOrphans } from '../../../src/utils/comments';
import { MOCK_APP_ACTIONS } from '../../fixtures/appActions';
import {
  MOCK_ORPHAN_COMMENT,
  MULTILINE_MOCK_COMMENTS,
  SINGLE_LINE_MOCK_COMMENTS,
} from '../../fixtures/appData';
import { MOCK_CODE_SETTINGS } from '../../fixtures/appSettings';

describe('Builder as Admin', () => {
  // define the context for the tests in this section
  const appContext = {
    context: Context.BUILDER,
    permission: PermissionLevel.Admin,
  };

  describe('No App Data', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appData: [] },
        appContext,
      });
      // got to app
      cy.visit('/');
      // open the Table View tab
      cy.get(buildDataCy(TAB_TABLE_VIEW_CYPRESS)).should('be.visible').click();
    });

    it('should show empty AppData table', () => {
      // check that the table view pane is visible
      cy.get(buildDataCy(TABLE_VIEW_PANE_CYPRESS)).should('be.visible');
      cy.get(buildDataCy(TABLE_VIEW_TABLE_CYPRESS)).should('be.visible');
      // check that the 'No comments' row is present
      cy.get(buildDataCy(TABLE_NO_COMMENTS_CYPRESS)).should('be.visible');
    });
  });

  describe('Download App Actions', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: { appActions: MOCK_APP_ACTIONS },
        appContext,
      });
      // got to app
      cy.visit('/');
      // open the Table View tab
      cy.get(buildDataCy(TAB_TABLE_VIEW_CYPRESS)).should('be.visible').click();
    });

    it.only('should download AppActions', () => {
      // check that the table view pane is visible
      cy.get(buildDataCy(DOWNLOAD_ACTIONS_BUTTON_CY))
        .should('be.visible')
        .click();
    });
  });

  describe('Review Comment AppData', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appData: [
            ...SINGLE_LINE_MOCK_COMMENTS,
            ...MULTILINE_MOCK_COMMENTS,
            MOCK_ORPHAN_COMMENT,
          ],
          appSettings: [MOCK_CODE_SETTINGS],
        },
        appContext,
      });
      // got to app
      cy.visit('/');
      // open the Table View tab
      cy.get(buildDataCy(TAB_TABLE_VIEW_CYPRESS)).should('be.visible').click();
    });

    it('Orphan comments', () => {
      // table view pane should be displayed
      cy.get(buildDataCy(TABLE_VIEW_PANE_CYPRESS)).should('be.visible');

      // check that all users are displayed
      const comments = List(
        [...SINGLE_LINE_MOCK_COMMENTS, ...MULTILINE_MOCK_COMMENTS].filter(
          (r) => r.type === APP_DATA_TYPES.COMMENT,
        ),
      ) as List<CommentType>;
      const orphansId = getOrphans(comments).map((c) => c.id);
      const nonOrphanComments = comments?.filter(
        (c) => !orphansId.includes(c.id),
      );
      // map resources to memberId and convert to JS to use the countBy function
      const users = nonOrphanComments.map((r) => r.memberId).toJS();
      const userCounts = countBy(users);

      // check that table is displayed
      cy.get(buildDataCy(TABLE_VIEW_TABLE_CYPRESS)).should('be.visible');
      // check that the expected number of users is displayed in the table
      cy.get(buildDataCy(TABLE_VIEW_BODY_USERS_CYPRESS))
        .children('tr')
        .should('have.length', Object.keys(userCounts).length);
      Object.entries(userCounts).forEach(([memberId, count]) => {
        cy.get(buildTableRowCypress(tableRowUserCypress(memberId)))
          .children(buildDataCy(TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS))
          .should('contain.text', count);
      });

      cy.get(buildDataCy(ORPHAN_BUTTON_CYPRESS)).should('exist').click();

      // number of displayed comments should not have changed
      Object.entries(userCounts).forEach(([memberId, count]) => {
        cy.get(buildTableRowCypress(tableRowUserCypress(memberId)))
          .children(buildDataCy(TABLE_VIEW_NB_COMMENTS_CELL_CYPRESS))
          .should('contain.text', count);
      });
    });

    it('Open Review Comment', () => {
      // select the first row in the users table
      cy.get(buildDataCy(TABLE_VIEW_BODY_USERS_CYPRESS)).children('tr').first();

      // get usernames in table
      cy.get(buildDataCy(TABLE_VIEW_USERNAME_CELL_CYPRESS)).as('usernames');

      // open every review and check that the name matches
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

              cy.get(
                `${buildDataCy(
                  TABLE_VIEW_USER_REVIEW_DIALOG_CYPRESS,
                )} ${buildDataCy(CUSTOM_DIALOG_CONTENT_CY)}`,
              ).get(buildDataCy(CODE_REVIEW_CONTAINER_CYPRESS));

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

const shouldDisplayDefaultAppView = (): void => {
  cy.get(buildDataCy(TAB_TABLE_VIEW_CYPRESS)).should('not.exist');
  cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
};

describe('Builder as Writer', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: [] },
      appContext: {
        context: Context.BUILDER,
        permission: PermissionLevel.Write,
      },
    });
    cy.visit('/');
  });

  it('Display Default AppView', () => {
    shouldDisplayDefaultAppView();
  });
});

describe('Builder as Read', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: [] },
      appContext: {
        context: Context.BUILDER,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('Display Default AppView', () => {
    shouldDisplayDefaultAppView();
  });
});
