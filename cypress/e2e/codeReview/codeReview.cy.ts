import { Context, PermissionLevel } from '@graasp/sdk';

import { INSTRUCTOR_CODE_ID } from '../../../src/config/constants';
import {
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
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
  COMMENT_EDITOR_TEXTAREA_HELPER_TEXT_CY,
  COMMENT_THREAD_CONTAINER_CYPRESS,
  COMMIT_INFO_DIALOG_CYPRESS,
  CUSTOM_DIALOG_TITLE_CYPRESS,
  DISPLAY_SETTINGS_FAB_CYPRESS,
  PLAYER_VIEW_CYPRESS,
  REPL_EDITOR_ID_CY,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SHOW_LINE_NUMBERS_SWITCH_CYPRESS,
  TAB_PRESET_VIEW_CYPRESS,
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
import { DEFAULT_GENERAL_SETTINGS } from '../../../src/config/settings';
import { Fields } from '../../../src/interfaces/enums';
import { GeneralSettingsKeys } from '../../../src/interfaces/settings';
import {
  MOCK_COMMIT_MESSAGE,
  SINGLE_LINE_MOCK_COMMENTS,
  generateSingleLineCommentThread,
} from '../../fixtures/appData';
import {
  CODE_REVIEW_MODE_SETTING,
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
        appSettings: [
          CODE_REVIEW_MODE_SETTING,
          MOCK_CODE_SETTINGS,
          MOCK_GENERAL_SETTINGS,
        ],
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Admin,
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
        appSettings: [
          CODE_REVIEW_MODE_SETTING,
          MOCK_CODE_SETTINGS,
          MOCK_GENERAL_SETTINGS,
        ],
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Admin,
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
          .children(`[data-cy^=${COMMENT_CONTAINER_CYPRESS}]`)
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
          CODE_REVIEW_MODE_SETTING,
          {
            ...MOCK_GENERAL_SETTINGS,
            data: {
              ...DEFAULT_GENERAL_SETTINGS,
              [GeneralSettingsKeys.ShowRunButton]: true,
              [GeneralSettingsKeys.ShowEditButton]: true,
              [GeneralSettingsKeys.ShowVersionNavigation]: true,
              [GeneralSettingsKeys.ShowLineNumbers]: true,
            },
          },
          MOCK_CODE_SETTINGS,
        ],
        members: Object.values(MEMBERS),
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Admin,
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
    cy.get(`[data-cy^=${COMMENT_CONTAINER_CYPRESS}]`).should(
      'have.length',
      numberOfThreads,
    );

    // click the toggle visibility button
    cy.get(buildDataCy(TOOLBAR_VISIBILITY_BUTTON_CYPRESS)).click();
    cy.get(`[data-cy^=${COMMENT_CONTAINER_CYPRESS}]`).should('have.length', 0);
    cy.get(buildDataCy(TOOLBAR_VISIBILITY_BUTTON_CYPRESS)).click();
    cy.get(`[data-cy^=${COMMENT_CONTAINER_CYPRESS}]`).should(
      'have.length',
      numberOfThreads,
    );
  });

  it.skip('should edit code', () => {
    const newCode = '#testing new code';
    // open editing
    cy.openCodeEditor();

    cy.typeInEditor(newCode);

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

describe('Comment settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          CODE_REVIEW_MODE_SETTING,
          {
            ...MOCK_GENERAL_SETTINGS,
            data: {
              ...DEFAULT_GENERAL_SETTINGS,
              [GeneralSettingsKeys.MaxCommentLength]: 20,
            },
          },
          MOCK_CODE_SETTINGS,
        ],
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('Limit length of comments to 20', () => {
    // add a new comment online 2
    cy.get(`[button-cy=${buildAddButtonDataCy(1)}`).click();

    // entter some text in the field
    cy.get(buildDataCy(COMMENT_EDITOR_TEXTAREA_CYPRESS)).type(
      '0123456789 012456789',
    );
    cy.get(buildDataCy(COMMENT_EDITOR_TEXTAREA_HELPER_TEXT_CY)).should(
      'contain.text',
      '20',
    );
  });
});

describe('Show Line Numbers Setting Builder View', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          MOCK_GENERAL_SETTINGS,
          {
            ...MOCK_GENERAL_SETTINGS,
            data: {
              ...DEFAULT_GENERAL_SETTINGS,
              [GeneralSettingsKeys.ShowLineNumbers]: true,
            },
          },
          MOCK_CODE_SETTINGS,
        ],
      },
      appContext: {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');
  });

  it('Toggling Line Numbers Switch from Display Settings', () => {
    // Check For Line Numbers Are Shown.
    // Open Preset View.
    cy.get(buildDataCy(TAB_PRESET_VIEW_CYPRESS))
      .should('be.visible')
      .as('presetViewTab')
      .click();
    // Open Display Settings.
    cy.get(buildDataCy(DISPLAY_SETTINGS_FAB_CYPRESS))
      .should('be.visible')
      .as('displaySettingsFab')
      .click();
    // Check that Line Numbers Switch is checked.
    cy.get(
      `${buildDataCy(SHOW_LINE_NUMBERS_SWITCH_CYPRESS)} input[type="checkbox"]`,
    ).should('be.checked');
    // Click on Cancel button from the display settings window.
    cy.get(buildDataCy(SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS))
      .as('cancelButton')
      .should('be.visible')
      .click();
    // Check that line numbers are shown.
    cy.get(`#${REPL_EDITOR_ID_CY} .cm-lineNumbers`).should('be.visible');
    // Check For Line Numbers Are Not Shown.
    // Open Display Settings.
    cy.get(buildDataCy(DISPLAY_SETTINGS_FAB_CYPRESS))
      .should('be.visible')
      .as('displaySettingsFab')
      .click();
    // Click on switch to toggle setting, check that the switch shouldn't be checked.
    cy.get(
      `${buildDataCy(SHOW_LINE_NUMBERS_SWITCH_CYPRESS)} input[type="checkbox"]`,
    ).click();
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.get(
      `${buildDataCy(SHOW_LINE_NUMBERS_SWITCH_CYPRESS)} input[type="checkbox"]`,
    ).should('not.to.be.checked');
    // Click on Save button from the display settings window.
    cy.get(buildDataCy(SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS))
      .as('saveButton')
      .should('not.be.disabled');
    cy.get(buildDataCy(SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS)).click({
      // this seems necessary even if the behavior is correct when doing it at human speeds
      force: true,
    });
    // Check that line numbers are not shown.
    cy.get(`#${REPL_EDITOR_ID_CY} .cm-lineNumbers`).should('not.exist');
  });
});
