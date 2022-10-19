import {
  CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS,
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_CONTAINER_CYPRESS,
  CODE_EDITOR_SUBMIT_BUTTON_CYPRESS,
  CODE_REVIEW_LINE_CONTENT_CYPRESS,
  CODE_REVIEW_LINE_CYPRESS,
  buildDataCy,
} from '../../../src/config/selectors';
import {
  CONTEXTS,
  DEFAULT_GENERAL_SETTINGS,
  PERMISSIONS,
} from '../../../src/config/settings';
import { SETTINGS_KEYS } from '../../../src/interfaces/settings';
import {
  MOCK_COMMIT_DESCRIPTION,
  MOCK_COMMIT_MESSAGE,
} from '../../fixtures/appData';
import {
  MOCK_CODE_SETTINGS,
  MOCK_GENERAL_SETTINGS,
} from '../../fixtures/appSettings';

describe('Code Editing', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: [
          {
            ...MOCK_GENERAL_SETTINGS,
            data: {
              ...DEFAULT_GENERAL_SETTINGS,
              [SETTINGS_KEYS.SHOW_EDIT_BUTTON]: true,
            },
          },
          MOCK_CODE_SETTINGS,
        ],
      },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.WRITE,
      },
    });
    cy.visit('/');
  });

  it('should edit code', () => {
    cy.openCodeEditor();

    cy.get(buildDataCy(CODE_EDITOR_CONTAINER_CYPRESS)).should('be.visible');

    cy.typeInEditor(`print('Hello World')`);

    cy.get(`${buildDataCy(CODE_EDITOR_COMMIT_MESSAGE_CYPRESS)}`).type(
      MOCK_COMMIT_MESSAGE,
    );
    cy.get(buildDataCy(CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS)).type(
      MOCK_COMMIT_DESCRIPTION,
    );

    cy.pause();

    // click the submit button
    cy.get(buildDataCy(CODE_EDITOR_SUBMIT_BUTTON_CYPRESS))
      .should('be.visible')
      .click();
  });

  it('should save empty code snippet', () => {
    cy.openCodeEditor();
    cy.typeInEditor(`print('Hello World')`);
    cy.typeInEditor('');
    // click the submit button
    cy.get(buildDataCy(CODE_EDITOR_SUBMIT_BUTTON_CYPRESS)).click();
    // check that the code is empty
    cy.get(buildDataCy(CODE_REVIEW_LINE_CYPRESS))
      .should('have.length', 1)
      .first()
      .get(buildDataCy(CODE_REVIEW_LINE_CONTENT_CYPRESS))
      .and('have.text', '\n');
  });
});
