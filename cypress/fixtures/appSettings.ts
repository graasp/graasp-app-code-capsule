import { v4 } from 'uuid';

import { AppSetting } from '@graasp/apps-query-client';

import {
  GENERAL_SETTINGS_KEY,
  INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
} from '../../src/config/appSettingsTypes';
import { DEFAULT_CODE_VERSION_SETTING } from '../../src/config/codeVersions';
import { PYTHON } from '../../src/config/constants';
import { DEFAULT_GENERAL_SETTINGS } from '../../src/config/settings';
import { CodeVersionType } from '../../src/interfaces/codeVersions';
import { MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

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

export const MOCK_GENERAL_SETTINGS = {
  id: v4(),
  name: GENERAL_SETTINGS_KEY,
  data: DEFAULT_GENERAL_SETTINGS,
  itemId: MOCK_SERVER_ITEM.id,
  creator: MEMBERS.BOB.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_CODE_SETTINGS: AppSetting & { data: CodeVersionType } = {
  id: v4(),
  name: INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
  data: {
    ...DEFAULT_CODE_VERSION_SETTING,
    commitMessage: MOCK_COMMIT_MESSAGE,
    commitDescription: MOCK_COMMIT_DESCRIPTION,
    code: MOCK_CODE_SAMPLE,
  },
  itemId: MOCK_SERVER_ITEM.id,
  creator: MEMBERS.BOB.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
    name: GENERAL_SETTINGS_KEY,
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
