import {
  CODE_REVIEW_CHATBOT_PROMPT_COMMENT_CY,
  CODE_REVIEW_CONTAINER_CYPRESS,
  COMMENT_EDITOR_SAVE_BUTTON_CYPRESS,
  COMMENT_EDITOR_TEXTAREA_CYPRESS,
  COMMENT_RESPONSE_BOX_CY,
  buildCommentContainerDataCy,
  buildDataCy,
} from '../../../src/config/selectors';
import { CHATBOT_THREAD_MOCK_COMMENTS } from '../../fixtures/appData';
import {
  CODE_REVIEW_MODE_SETTING,
  MOCK_CHATBOT_PROMPT_SETTINGS_INPUT,
  MOCK_CODE_SETTINGS,
} from '../../fixtures/appSettings';

describe('OpenAI api chatbot', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          // set the view to "code-review" mode
          CODE_REVIEW_MODE_SETTING,
          // set some code
          MOCK_CODE_SETTINGS,
          // chatbot prompt setting
          MOCK_CHATBOT_PROMPT_SETTINGS_INPUT,
        ],
        appData: [
          // chatbot thread
          ...CHATBOT_THREAD_MOCK_COMMENTS,
        ],
      },
    });
    cy.visit('/');
  });

  it.only('show chatbot thread', () => {
    cy.get(buildDataCy(CODE_REVIEW_CONTAINER_CYPRESS)).should('be.visible');

    // check that the first comment is displayed
    cy.get(
      buildDataCy(
        buildCommentContainerDataCy(CHATBOT_THREAD_MOCK_COMMENTS[0].id),
      ),
    ).should('be.visible');
    cy.get(buildDataCy(COMMENT_RESPONSE_BOX_CY)).click();
    cy.get(buildDataCy(COMMENT_EDITOR_TEXTAREA_CYPRESS)).type('test');
    cy.get(buildDataCy(COMMENT_EDITOR_SAVE_BUTTON_CYPRESS)).click();
  });

  it('show a bot comment', () => {
    cy.get(buildDataCy(CODE_REVIEW_CONTAINER_CYPRESS)).should('be.visible');

    // check that the bot comment is shown
    cy.get(buildDataCy(CODE_REVIEW_CHATBOT_PROMPT_COMMENT_CY)).should(
      'be.visible',
    );
  });
});
