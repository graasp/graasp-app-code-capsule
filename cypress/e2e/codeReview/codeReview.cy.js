import { MOCK_APP_DATA } from '../../fixtures/appData';
import { CONTEXTS, PERMISSIONS } from '../../../src/config/settings';
import {
  buildAddButtonDataCy,
  buildDataCy,
  CODE_REVIEW_ADD_BUTTON_CYPRESS,
  CODE_REVIEW_CONTAINER_CYPRESS,
  CODE_REVIEW_LINE_CYPRESS,
  COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS,
  COMMENT_EDITOR_CYPRESS,
  COMMENT_EDITOR_LINE_INFO_TEXT_CYPRESS,
  COMMENT_EDITOR_SAVE_BUTTON_CYPRESS,
  COMMENT_EDITOR_TEXTAREA_CYPRESS,
  PLAYER_VIEW_CYPRESS,
} from '../../../src/config/selectors';
import {
  MOCK_CODE_SAMPLE,
  MOCK_GENERAL_SETTINGS,
} from '../../fixtures/appSettings';
import { CURRENT_MEMBER } from '../../fixtures/members';

describe('Code review', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: MOCK_APP_DATA,
        appSettings: [MOCK_GENERAL_SETTINGS],
      },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.ADMIN,
        currentMember: CURRENT_MEMBER,
      },
    });
    cy.visit('/');
  });

  const codeLines = MOCK_CODE_SAMPLE.split('\n');

  it('should show the code review', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
    cy.get(buildDataCy(CODE_REVIEW_CONTAINER_CYPRESS)).should('be.visible');
    // check code
    cy.get(buildDataCy(CODE_REVIEW_LINE_CYPRESS)).each((el, index) =>
      cy.wrap(el).should('contain', codeLines[index]),
    );
  });

  it('should display add-comment buttons', () => {
    // check that all buttons are displayed
    cy.get(buildDataCy(CODE_REVIEW_ADD_BUTTON_CYPRESS)).should(
      'have.length',
      codeLines.length,
    );
    // check each button individually
    codeLines.forEach((line, index) => {
      cy.get(`[button-cy=${buildAddButtonDataCy(index + 1)}`).should(
        'be.visible',
      );
    });
  });

  it('should open single line comment', () => {
    // click on the second button
    cy.get(`[button-cy=${buildAddButtonDataCy(2)}`).click();
    cy.get(buildDataCy(COMMENT_EDITOR_CYPRESS)).should('be.visible');
    cy.get(buildDataCy(COMMENT_EDITOR_LINE_INFO_TEXT_CYPRESS)).should(
      'contain',
      'Line Comment: 2',
    );
    cy.get(buildDataCy(COMMENT_EDITOR_SAVE_BUTTON_CYPRESS)).should(
      'be.visible',
    );
    cy.get(buildDataCy(COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS))
      .should('be.visible')
      .click();
    // cy.get(buildDataCy(COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS)).click();
    cy.get(buildDataCy(COMMENT_EDITOR_CYPRESS)).should('not.exist');
  });

  it('should open multiline comment', () => {
    // multiline comment
    const start = 2;
    const end = 7;
    cy.get(`[button-cy=${buildAddButtonDataCy(start)}`).click({
      shiftKey: true,
    });
    cy.get(`[button-cy=${buildAddButtonDataCy(end)}`).click({ shiftKey: true });
    cy.get(buildDataCy(COMMENT_EDITOR_CYPRESS)).should('be.visible');
    cy.get(buildDataCy(COMMENT_EDITOR_LINE_INFO_TEXT_CYPRESS)).should(
      'contain',
      `Multiline Comment: ${start} - ${end}`,
    );
    cy.get(buildDataCy(COMMENT_EDITOR_SAVE_BUTTON_CYPRESS)).should(
      'be.visible',
    );
    cy.get(buildDataCy(COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS)).should(
      'be.visible',
    );

    cy.get(buildDataCy(COMMENT_EDITOR_TEXTAREA_CYPRESS)).type('test');
    cy.get(buildDataCy(COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS)).click();
    cy.get(buildDataCy(COMMENT_EDITOR_CYPRESS)).should('not.exist');
  });
});
