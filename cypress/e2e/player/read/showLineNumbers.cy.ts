import { Context, PermissionLevel } from '@graasp/sdk';

import {
  LINE_NUMBERS_CY,
  REPL_EDITOR_ID_CY,
  buildDataCy,
} from '../../../../src/config/selectors';
import { DEFAULT_GENERAL_SETTINGS } from '../../../../src/config/settings';
import { GeneralSettingsKeys } from '../../../../src/interfaces/settings';
import {
  CODE_EXECUTION_MODE_SETTING,
  CODE_REVIEW_MODE_SETTING,
  MOCK_CODE_SETTINGS,
  MOCK_GENERAL_SETTINGS,
} from '../../../fixtures/appSettings';

describe('Show Line Numbers Code Review', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          CODE_REVIEW_MODE_SETTING,
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
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });
  it('Should display line numbers when "ShowLineNumbers" is true', () => {
    cy.get(buildDataCy(LINE_NUMBERS_CY)).should('be.visible');
  });
});

describe('Hide Line Numbers Code Review', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          CODE_REVIEW_MODE_SETTING,
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
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });
  it('Should not display line numbers when "ShowLineNumbers" is false', () => {
    // Check that the LineNo component does not exist when ShowLineNumbers is false.
    cy.get(buildDataCy(LINE_NUMBERS_CY)).should('not.exist');
  });
});

describe('Show Line Numbers Code Execution', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          CODE_EXECUTION_MODE_SETTING,
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
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });
  it('Should not display line numbers when "ShowLineNumbers" is false', () => {
    // Check that the LineNo component does not exist when ShowLineNumbers is false.
    cy.get(`#${REPL_EDITOR_ID_CY} .cm-lineNumbers`).should('be.visible');
  });
});

describe('Hide Line Numbers Code Execution', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [
          CODE_EXECUTION_MODE_SETTING,
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
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });
  it('Should not display line numbers when "ShowLineNumbers" is false', () => {
    // Check that the LineNo component does not exist when ShowLineNumbers is false.
    cy.get(`#${REPL_EDITOR_ID_CY} .cm-lineNumbers`).should('not.exist');
  });
});
