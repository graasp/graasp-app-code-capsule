import { REPL_CONTAINER_CY, buildDataCy } from '../../../src/config/selectors';
import { CONTEXTS, PERMISSIONS } from '../../../src/config/settings';
import { MOCK_CODE_SETTINGS } from '../../fixtures/appSettings';

describe('Display Code interface', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: { appSettings: [MOCK_CODE_SETTINGS] },
      appContext: {
        context: CONTEXTS.PLAYER,
        permission: PERMISSIONS.WRITE,
      },
    });
    cy.visit('/');
    cy.openRepl();
  });
  it('displays the interface', () => {
    cy.get(buildDataCy(REPL_CONTAINER_CY));
  });
});
