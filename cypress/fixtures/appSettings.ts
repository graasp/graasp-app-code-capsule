import { v4 } from 'uuid';

import { AppSetting } from '@graasp/apps-query-client';

import {
  APP_MODE_SETTINGS_NAME,
  AppMode,
  CODE_EXECUTION_SETTINGS_NAME,
  GENERAL_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../../src/config/appSettingsTypes';
import { DEFAULT_CODE_VERSION_SETTING } from '../../src/config/codeVersions';
import { PYTHON } from '../../src/config/constants';
import {
  DEFAULT_APP_MODE_SETTING,
  DEFAULT_CODE_EXECUTION_SETTINGS,
  DEFAULT_GENERAL_SETTINGS,
} from '../../src/config/settings';
import { CodeVersionType } from '../../src/interfaces/codeVersions';
import {
  AppModeSetting,
  CodeExecutionSettings,
} from '../../src/interfaces/settings';
import { MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

export const HEADER_CODE_MESSAGE = 'Hello World';
export const FOOTER_CODE_MESSAGE = 'GoodBye World';
export const printMessageCode = (msg: string): string => `print('${msg}')`;
export const MOCK_CODE_SAMPLE = `# my sample code in python

age = input('What is your age ?')

# ask another question
print('wait a bit')
'''
and here starts a
multiline comment
'''
print('Done!')
`;

const MOCK_COMMIT_MESSAGE = 'This is a mock commit message';
const MOCK_COMMIT_DESCRIPTION =
  'This is a mock commit Description\nOn multiple lines';

export const EMPTY_SETTING: AppSetting = {
  id: v4(),
  name: '',
  data: {},
  itemId: MOCK_SERVER_ITEM.id,
  creator: MEMBERS.BOB.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_GENERAL_SETTINGS = {
  ...EMPTY_SETTING,
  id: v4(),
  name: GENERAL_SETTINGS_NAME,
  data: DEFAULT_GENERAL_SETTINGS,
};

export const MOCK_CODE_EXECUTION_SETTINGS: AppSetting & {
  data: CodeExecutionSettings;
} = {
  ...EMPTY_SETTING,
  id: v4(),
  name: CODE_EXECUTION_SETTINGS_NAME,
  data: {
    ...DEFAULT_CODE_EXECUTION_SETTINGS,
    header_code: printMessageCode(HEADER_CODE_MESSAGE),
    footer_code: printMessageCode(FOOTER_CODE_MESSAGE),
  },
};

export const MOCK_APP_MODE_SETTING: AppSetting & { data: AppModeSetting } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: APP_MODE_SETTINGS_NAME,
  data: DEFAULT_APP_MODE_SETTING,
};

export const CODE_EXECUTION_MODE_SETTING: AppSetting & {
  data: AppModeSetting;
} = {
  ...MOCK_APP_MODE_SETTING,
  data: {
    mode: AppMode.Execute,
  },
};

export const CODE_REVIEW_MODE_SETTING: AppSetting & {
  data: AppModeSetting;
} = {
  ...MOCK_APP_MODE_SETTING,
  data: {
    mode: AppMode.Review,
  },
};

export const CODE_COLLABORATE_MODE_SETTING: AppSetting & {
  data: AppModeSetting;
} = {
  ...MOCK_APP_MODE_SETTING,
  data: {
    mode: AppMode.Collaborate,
  },
};

export const MOCK_CODE_SETTINGS: AppSetting & { data: CodeVersionType } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  data: {
    ...DEFAULT_CODE_VERSION_SETTING,
    commitMessage: MOCK_COMMIT_MESSAGE,
    commitDescription: MOCK_COMMIT_DESCRIPTION,
    code: MOCK_CODE_SAMPLE,
  },
};

export const MOCK_EXECUTABLE_PYTHON_CODE_SETTINGS: AppSetting & {
  data: CodeVersionType;
} = {
  ...MOCK_CODE_SETTINGS,
  id: v4(),
  data: {
    language: PYTHON,
    commitMessage: MOCK_COMMIT_MESSAGE,
    commitDescription: MOCK_COMMIT_DESCRIPTION,
    code: MOCK_CODE_SAMPLE,
  },
};

export const MOCK_APP_SETTINGS: AppSetting[] = [
  {
    id: v4(),
    name: GENERAL_SETTINGS_NAME,
    data: {
      ...DEFAULT_GENERAL_SETTINGS,
      code: MOCK_CODE_SAMPLE,
    },
    itemId: MOCK_SERVER_ITEM.id,
    creator: MEMBERS.BOB.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
