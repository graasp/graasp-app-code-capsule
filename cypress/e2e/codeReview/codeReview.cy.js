import {
  generateSingleLineCommentThread,
  SINGLE_LINE_MOCK_COMMENTS,
} from '../../fixtures/appData';
import {
  CONTEXTS,
  DEFAULT_GENERAL_SETTINGS,
  PERMISSIONS,
} from '../../../src/config/settings';
import {
  buildAddButtonDataCy,
  buildDataCy,
  CODE_REVIEW_ADD_BUTTON_CYPRESS,
  CODE_REVIEW_CONTAINER_CYPRESS,
  CODE_REVIEW_LINE_CYPRESS,
  CODE_REVIEW_TOOLBAR_CYPRESS,
  COMMENT_CONTAINER_CYPRESS,
  COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS,
  COMMENT_EDITOR_CYPRESS,
  COMMENT_EDITOR_LINE_INFO_TEXT_CYPRESS,
  COMMENT_EDITOR_SAVE_BUTTON_CYPRESS,
  COMMENT_EDITOR_TEXTAREA_CYPRESS,
  COMMENT_THREAD_CONTAINER_CYPRESS,
  PLAYER_VIEW_CYPRESS,
  TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS,
  TOOLBAR_EDIT_CODE_BUTTON_CYPRESS,
  TOOLBAR_RUN_CODE_BUTTON_CYPRESS,
  TOOLBAR_VISIBILITY_BUTTON_CYPRESS,
} from '../../../src/config/selectors';
import {
  MOCK_CODE_SAMPLE,
  MOCK_GENERAL_SETTINGS,
} from '../../fixtures/appSettings';
import { CURRENT_MEMBER } from '../../fixtures/members';
import { SLOW_DOWN_CYPRESS_DELAY } from '../../fixtures/constants';
import { SETTINGS_KEYS } from '../../../src/interfaces/settings';

// importing a const from a file and using it in cy.wait() produces an error:
// https://github.com/cypress-io/eslint-plugin-cypress/issues/43#issuecomment-986675657
const waitingDelay = SLOW_DOWN_CYPRESS_DELAY;

describe('Code review single comments', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: SINGLE_LINE_MOCK_COMMENTS,
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
    cy.get(buildDataCy(COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS)).should(
      'be.visible',
    );
    cy.wait(waitingDelay);
    cy.get(buildDataCy(COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS)).click();

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
    cy.wait(waitingDelay);
    cy.get(buildDataCy(COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS)).click();
    cy.get(buildDataCy(COMMENT_EDITOR_CYPRESS)).should('not.exist');
  });
});

describe('Code Review thread comments', () => {
  const threadOptions = [
    { lineIndex: 1, threadLength: 2 },
    { lineIndex: 3, threadLength: 4 },
  ];
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: generateSingleLineCommentThread(threadOptions),
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

  it.only('should display threads', () => {
    cy.get(buildDataCy(CODE_REVIEW_CONTAINER_CYPRESS)).should('exist');

    // check that the threads are rendered
    cy.get(buildDataCy(COMMENT_THREAD_CONTAINER_CYPRESS))
      .should('have.length', 2)
      .each((el, i) => {
        cy.wrap(el)
          .children(buildDataCy(COMMENT_CONTAINER_CYPRESS))
          .should('have.length', threadOptions[i].threadLength);
      });
  });
});

describe('Code Review Tools', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: SINGLE_LINE_MOCK_COMMENTS,
        appSettings: [
          {
            ...MOCK_GENERAL_SETTINGS,
            data: {
              ...DEFAULT_GENERAL_SETTINGS,
              [SETTINGS_KEYS.SHOW_EDIT_BUTTON]: true,
              [SETTINGS_KEYS.SHOW_VERSION_NAVIGATION]: true,
              [SETTINGS_KEYS.CODE]: MOCK_CODE_SAMPLE,
            },
          },
        ],
      },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.ADMIN,
        currentMember: CURRENT_MEMBER,
      },
    });
    cy.visit('/');
  });

  it('show toolbar', () => {
    cy.get(buildDataCy(CODE_REVIEW_TOOLBAR_CYPRESS)).should('be.visible');

    // check that buttons are present
    cy.get(buildDataCy(TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS)).should(
      'be.visible',
    );
    cy.get(buildDataCy(TOOLBAR_EDIT_CODE_BUTTON_CYPRESS)).should('be.visible');
    cy.get(buildDataCy(TOOLBAR_RUN_CODE_BUTTON_CYPRESS)).should('be.visible');
    cy.get(buildDataCy(TOOLBAR_VISIBILITY_BUTTON_CYPRESS)).should('be.visible');

    cy.get(buildDataCy(COMMENT_CONTAINER_CYPRESS)).should(
      'have.length',
      SINGLE_LINE_MOCK_COMMENTS.length,
    );

    // click the toggle visibility button
    cy.get(buildDataCy(TOOLBAR_VISIBILITY_BUTTON_CYPRESS)).click();
    cy.get(buildDataCy(COMMENT_CONTAINER_CYPRESS)).should('have.length', 0);
    cy.get(buildDataCy(TOOLBAR_VISIBILITY_BUTTON_CYPRESS)).click();
    cy.get(buildDataCy(COMMENT_CONTAINER_CYPRESS)).should(
      'have.length',
      SINGLE_LINE_MOCK_COMMENTS.length,
    );

    // todo: test edit button

    // todo: test code info button
  });
});
