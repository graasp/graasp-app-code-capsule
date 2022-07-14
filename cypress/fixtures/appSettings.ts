import { v4 } from 'uuid';

import {
  GENERAL_SETTINGS_KEY,
  INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
} from '../../src/config/appSettingsTypes';
import { DEFAULT_CODE_VERSION_SETTING } from '../../src/config/codeVersions';
import { DEFAULT_GENERAL_SETTINGS } from '../../src/config/settings';

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
};

export const MOCK_CODE_SETTINGS = {
  id: v4(),
  name: INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
  data: {
    ...DEFAULT_CODE_VERSION_SETTING,
    commitMessage: MOCK_COMMIT_MESSAGE,
    commitDescription: MOCK_COMMIT_DESCRIPTION,
    code: MOCK_CODE_SAMPLE,
  },
};
export const MOCK_APP_SETTINGS = [
  {
    id: v4(),
    name: GENERAL_SETTINGS_KEY,
    data: {
      ...DEFAULT_GENERAL_SETTINGS,
      code: MOCK_CODE_SAMPLE,
    },
  },
];
