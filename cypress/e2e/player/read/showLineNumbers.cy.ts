import { Context, PermissionLevel } from '@graasp/sdk';

import { LINE_NUMBERS, buildDataCy } from '../../../../src/config/selectors';
import { DEFAULT_GENERAL_SETTINGS } from '../../../../src/config/settings';
import { GeneralSettingsKeys } from '../../../../src/interfaces/settings';
import {
  MOCK_CODE_SETTINGS,
  MOCK_GENERAL_SETTINGS,
} from '../../../fixtures/appSettings';

describe('Show Line Numbers Setting Player View', () => {
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
        context: Context.PLAYER,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });
  it('Should display line numbers when "ShowLineNumbers" is ture', () => {
    cy.get(buildDataCy(LINE_NUMBERS)).should('be.visible');
  });
  it('Should not display line numbers when "ShowLineNumbers" is false', () => {
    cy.setUpApi({
      database: {
        appSettings: [
          MOCK_GENERAL_SETTINGS,
          {
            ...MOCK_GENERAL_SETTINGS,
            data: {
              ...DEFAULT_GENERAL_SETTINGS,
              [GeneralSettingsKeys.ShowLineNumbers]: false,
            },
          },
          MOCK_CODE_SETTINGS,
        ],
      },
      appContext: {
        context: Context.PLAYER,
        permission: PermissionLevel.Read,
      },
    });
    // Check that the LineNo component does not exist when ShowLineNumbers is false.
    cy.get(buildDataCy(LINE_NUMBERS)).should('not.be.visible');
  });
});
