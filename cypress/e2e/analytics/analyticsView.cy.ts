import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ANALYTICS_VIEW_CY,
  STATISTIC_RUNNING_VERSIONS_KEY,
  STATISTIC_SAVED_VERSIONS_KEY,
  STATISTIC_TOTAL_USERS_KEY,
  buildDataCy,
  buildStatisticCardID,
} from '../../../src/config/selectors';
import { MOCK_APP_ACTIONS } from '../../fixtures/appActions';

describe('Analytics View', () => {
  beforeEach(() => {
    cy.setUpApi({
      appContext: {
        context: Context.Analytics,
        permission: PermissionLevel.Admin,
      },
      database: { appActions: MOCK_APP_ACTIONS },
    });
    cy.visit('/');
  });

  it('should open Analytics view', () => {
    cy.get(buildDataCy(ANALYTICS_VIEW_CY)).should('be.visible');
  });

  it('should have total users general statistic', () => {
    cy.get(`#${buildStatisticCardID(STATISTIC_TOTAL_USERS_KEY)}`)
      .should('be.visible')
      .and('have.text', '2');
  });

  it('should have average saved versions general statistic', () => {
    cy.get(`#${buildStatisticCardID(STATISTIC_SAVED_VERSIONS_KEY)}`)
      .should('be.visible')
      .and('have.text', '1');
  });

  it('should have average running versions general statistic', () => {
    cy.get(`#${buildStatisticCardID(STATISTIC_RUNNING_VERSIONS_KEY)}`)
      .should('be.visible')
      .and('have.text', '1');
  });
});
