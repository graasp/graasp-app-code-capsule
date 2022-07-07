import {
  CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS,
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_CONTAINER_CYPRESS,
  CODE_EDITOR_CYPRESS,
  CODE_EDITOR_SUBMIT_BUTTON_CYPRESS,
  TOOLBAR_EDIT_CODE_BUTTON_CYPRESS,
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
    cy.get(buildDataCy(TOOLBAR_EDIT_CODE_BUTTON_CYPRESS)).click();

    cy.get(buildDataCy(CODE_EDITOR_CONTAINER_CYPRESS)).should('be.visible');

    cy.get(CODE_EDITOR_CYPRESS)
      .click()
      .focused()
      .type(`{selectall}print('Hello World')`);

    cy.get(`${buildDataCy(CODE_EDITOR_COMMIT_MESSAGE_CYPRESS)}`).type(
      MOCK_COMMIT_MESSAGE,
    );
    cy.get(buildDataCy(CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS)).type(
      MOCK_COMMIT_DESCRIPTION,
    );

    // click the submit button
    cy.get(buildDataCy(CODE_EDITOR_SUBMIT_BUTTON_CYPRESS))
      .should('be.visible')
      .click();
  });
});
