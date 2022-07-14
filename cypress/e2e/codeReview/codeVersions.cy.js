import {
  DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH,
  INSTRUCTOR_CODE_ID,
  INSTRUCTOR_CODE_NAME,
  REVIEW_MODE_COLLABORATIVE,
} from '../../../src/config/constants';
import {
  TOOLBAR_USER_SELECT_CYPRESS,
  TOOLBAR_VERSION_SELECT_CYPRESS,
  buildDataCy,
} from '../../../src/config/selectors';
import {
  CONTEXTS,
  DEFAULT_GENERAL_SETTINGS,
  PERMISSIONS,
} from '../../../src/config/settings';
import { SETTINGS_KEYS } from '../../../src/interfaces/settings';
import { MOCK_CODE_VERSIONS } from '../../fixtures/appData';
import {
  MOCK_CODE_SETTINGS,
  MOCK_GENERAL_SETTINGS,
} from '../../fixtures/appSettings';
import { MEMBERS } from '../../fixtures/members';

describe('Code Versions', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: MOCK_CODE_VERSIONS,
        appSettings: [
          MOCK_CODE_SETTINGS,
          {
            ...MOCK_GENERAL_SETTINGS,
            data: {
              ...DEFAULT_GENERAL_SETTINGS,
              [SETTINGS_KEYS.REVIEW_MODE]: REVIEW_MODE_COLLABORATIVE,
              [SETTINGS_KEYS.SHOW_VERSION_NAVIGATION]: true,
            },
          },
        ],
      },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.ADMIN,
      },
    });
    cy.visit('/');
  });

  it('should switch code versions', () => {
    // check initial state of user select
    cy.get(`${buildDataCy(TOOLBAR_USER_SELECT_CYPRESS)} > input`).should(
      'have.value',
      INSTRUCTOR_CODE_ID,
    );
    cy.get(`${buildDataCy(TOOLBAR_USER_SELECT_CYPRESS)} > div`).should(
      'have.text',
      INSTRUCTOR_CODE_NAME,
    );

    // check initial state of version select
    cy.get(`${buildDataCy(TOOLBAR_VERSION_SELECT_CYPRESS)} > input`).should(
      'have.value',
      INSTRUCTOR_CODE_ID,
    );
    cy.get(`${buildDataCy(TOOLBAR_VERSION_SELECT_CYPRESS)} > div`).should(
      'contain.text',
      MOCK_CODE_SETTINGS.data.commitMessage.slice(
        0,
        DEFAULT_TRUNCATION_COMMIT_MESSAGE_LENGTH,
      ),
    );

    // open dropdown
    cy.get(buildDataCy(TOOLBAR_USER_SELECT_CYPRESS)).click();
    cy.get(`ul > li[data-value="${MEMBERS.BOB.id}"]`).click();
    cy.get(`${buildDataCy(TOOLBAR_VERSION_SELECT_CYPRESS)} > input`).should(
      'have.value',
      MOCK_CODE_VERSIONS[0].id,
    );
  });
});
