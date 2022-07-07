import { INSTRUCTOR_CODE_ID } from '../../../src/config/constants';
import {
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_CYPRESS,
  CODE_EDITOR_SUBMIT_BUTTON_CYPRESS,
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
  COMMIT_INFO_DIALOG_CYPRESS,
  CUSTOM_DIALOG_TITLE_CYPRESS,
  PLAYER_VIEW_CYPRESS,
  TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS,
  TOOLBAR_EDIT_CODE_BUTTON_CYPRESS,
  TOOLBAR_RUN_CODE_BUTTON_CYPRESS,
  TOOLBAR_USER_SELECT_CYPRESS,
  TOOLBAR_VISIBILITY_BUTTON_CYPRESS,
  buildAddButtonDataCy,
  buildCommitFieldCypress,
  buildCommitFieldDataCy,
  buildDataCy,
} from '../../../src/config/selectors';
import {
  CONTEXTS,
  DEFAULT_GENERAL_SETTINGS,
  PERMISSIONS,
} from '../../../src/config/settings';
import { Fields } from '../../../src/interfaces/commitInfo';
import { SETTINGS_KEYS } from '../../../src/interfaces/settings';
import {
  MOCK_COMMIT_MESSAGE,
  SINGLE_LINE_MOCK_COMMENTS,
  generateSingleLineCommentThread,
} from '../../fixtures/appData';
import {
  MOCK_CODE_SAMPLE,
  MOCK_CODE_SETTINGS,
  MOCK_GENERAL_SETTINGS,
} from '../../fixtures/appSettings';
import { SLOW_DOWN_CYPRESS_DELAY } from '../../fixtures/constants';
import { CURRENT_MEMBER, MEMBERS } from '../../fixtures/members';

// importing a const from a file and using it in cy.wait() produces an error:
// https://github.com/cypress-io/eslint-plugin-cypress/issues/43#issuecomment-986675657
const waitingDelay = SLOW_DOWN_CYPRESS_DELAY;

describe('Code review single comments', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: SINGLE_LINE_MOCK_COMMENTS,
        appSettings: [MOCK_CODE_SETTINGS, MOCK_GENERAL_SETTINGS],
      },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.ADMIN,
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
      cy.get(`[button-cy=${buildAddButtonDataCy(index)}`).should('be.visible');
    });
  });

  it('should open single line comment', () => {
    // click on the second button
    cy.get(`[button-cy=${buildAddButtonDataCy(1)}`).click();
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
        appSettings: [MOCK_CODE_SETTINGS, MOCK_GENERAL_SETTINGS],
      },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.ADMIN,
      },
    });
    cy.visit('/');
  });

  it('should display threads', () => {
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
            },
          },
          MOCK_CODE_SETTINGS,
        ],
        members: Object.values(MEMBERS),
      },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.ADMIN,
        lang: 'fr',
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

    const numberOfThreads = SINGLE_LINE_MOCK_COMMENTS.filter(
      (c) => c.data.parent === null,
    ).length;
    cy.get(buildDataCy(COMMENT_CONTAINER_CYPRESS)).should(
      'have.length',
      numberOfThreads,
    );

    // click the toggle visibility button
    cy.get(buildDataCy(TOOLBAR_VISIBILITY_BUTTON_CYPRESS)).click();
    cy.get(buildDataCy(COMMENT_CONTAINER_CYPRESS)).should('have.length', 0);
    cy.get(buildDataCy(TOOLBAR_VISIBILITY_BUTTON_CYPRESS)).click();
    cy.get(buildDataCy(COMMENT_CONTAINER_CYPRESS)).should(
      'have.length',
      numberOfThreads,
    );
  });

  it('should edit code', () => {
    const newCode = '#testing new code';
    // open editing
    cy.get(buildDataCy(TOOLBAR_EDIT_CODE_BUTTON_CYPRESS))
      .should('be.visible')
      .click();

    // enter new code (need to clear two times because otherwise it does not clear everything
    cy.wait(waitingDelay);
    cy.get(CODE_EDITOR_CYPRESS).type(
      `{selectall}{backspace}{selectall}{backspace}${newCode}`,
    );

    // enter a commit message
    cy.get(buildDataCy(CODE_EDITOR_COMMIT_MESSAGE_CYPRESS)).type(
      MOCK_COMMIT_MESSAGE,
    );
    cy.get(buildDataCy(CODE_EDITOR_SUBMIT_BUTTON_CYPRESS)).click();

    // check that the version was updated in the dropdowns
    const currentMemberId = CURRENT_MEMBER.id;
    cy.get(`${buildDataCy(TOOLBAR_USER_SELECT_CYPRESS)} > input`).as('select');
    cy.get(buildDataCy(TOOLBAR_USER_SELECT_CYPRESS)).click();
    cy.get(`ul > li[data-value="${currentMemberId}"]`).click();
    cy.get('@select').should('have.value', currentMemberId);
  });

  it('should show commit info', () => {
    cy.get(buildDataCy(TOOLBAR_COMMIT_INFO_BUTTON_CYPRESS)).click();

    cy.get(
      `${buildDataCy(COMMIT_INFO_DIALOG_CYPRESS)} ${buildDataCy(
        CUSTOM_DIALOG_TITLE_CYPRESS,
      )}`,
    )
      .should('be.visible')
      .and('contain.text', 'Commit'.toLowerCase());

    const fieldValues = {
      [Fields.Author]: INSTRUCTOR_CODE_ID,
      [Fields.Message]: MOCK_CODE_SETTINGS.data.commitMessage,
      [Fields.Description]: MOCK_CODE_SETTINGS.data.commitDescription,
      // we do not check the date
      [Fields.Created]: '',
    };

    Object.values(Fields).forEach((field) => {
      cy.get(buildCommitFieldCypress(buildCommitFieldDataCy(field)))
        .should('be.visible')
        .and('contain.text', fieldValues[field]);
    });
  });
});
