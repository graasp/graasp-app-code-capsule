import { MOCK_APP_DATA } from '../../fixtures/appData';
import { CONTEXTS, PERMISSIONS } from '../../../src/config/settings';
import {
  buildDataCy,
  CODE_REVIEW_CONTAINER_CYPRESS,
  CODE_REVIEW_LINE_CYPRESS,
  PLAYER_VIEW_CYPRESS,
} from '../../../src/config/selectors';
import { MOCK_CODE_SAMPLE } from '../../fixtures/appSettings';
import { CURRENT_MEMBER } from '../../fixtures/members';

describe('Code review', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appData: MOCK_APP_DATA },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.ADMIN,
        currentMember: CURRENT_MEMBER,
      },
    });
    cy.visit('/');
  });

  it('should show the code review', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CYPRESS)).should('be.visible');
    cy.get(buildDataCy(CODE_REVIEW_CONTAINER_CYPRESS)).should('be.visible');
    // check code
    cy.get(buildDataCy(CODE_REVIEW_LINE_CYPRESS)).each((el, index) =>
      cy.wrap(el).should('contain', MOCK_CODE_SAMPLE.split('\n')[index]),
    );
  });
});
