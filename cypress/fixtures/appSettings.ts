import type { AppSetting } from '@graasp/sdk';

import { v4 } from 'uuid';

import {
  APP_MODE_SETTINGS_NAME,
  AppMode,
  CHATBOT_PROMPT_SETTINGS_NAME,
  CODE_EXECUTION_SETTINGS_NAME,
  DIFF_VIEW_SETTINGS_NAME,
  GENERAL_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../../src/config/appSettingsTypes';
import { PYTHON } from '../../src/config/programmingLanguages';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_CHATBOT_PROMPT_SETTINGS,
  DEFAULT_CODE_EXECUTION_SETTINGS,
  DEFAULT_DIFF_VIEW_SETTINGS,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../../src/config/settings';
import { CodeVersionType } from '../../src/interfaces/codeVersions';
import {
  AppModeSettings,
  ChatbotPromptSettings,
  CodeExecutionSettings,
  DiffViewSettings,
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

export const MOCK_DIFF_OLD_CODE =
  'if not value is None:\n    print("not none")';

export const MOCK_DIFF_NEW_CODE =
  'if value is not None:\n    print("not none")';

export const EMPTY_SETTING: AppSetting = {
  id: v4(),
  name: '',
  data: {},
  item: MOCK_SERVER_ITEM,
  creator: MEMBERS.BOB,
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
    headerCode: printMessageCode(HEADER_CODE_MESSAGE),
    footerCode: printMessageCode(FOOTER_CODE_MESSAGE),
  },
};

export const MOCK_APP_MODE_SETTING: AppSetting & { data: AppModeSettings } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: APP_MODE_SETTINGS_NAME,
  data: DEFAULT_APP_MODE_SETTINGS,
};

export const CODE_EXECUTION_MODE_SETTING: AppSetting & {
  data: AppModeSettings;
} = {
  ...MOCK_APP_MODE_SETTING,
  data: {
    mode: AppMode.Execute,
  },
};

export const CODE_REVIEW_MODE_SETTING: AppSetting & {
  data: AppModeSettings;
} = {
  ...MOCK_APP_MODE_SETTING,
  data: {
    mode: AppMode.Review,
  },
};

export const CODE_COLLABORATE_MODE_SETTING: AppSetting & {
  data: AppModeSettings;
} = {
  ...MOCK_APP_MODE_SETTING,
  data: {
    mode: AppMode.Collaborate,
  },
};

export const CODE_EXPLAIN_MODE_SETTING: AppSetting & {
  data: AppModeSettings;
} = {
  ...MOCK_APP_MODE_SETTING,
  data: {
    mode: AppMode.Explain,
  },
};

export const MOCK_CODE_SETTINGS: AppSetting & { data: CodeVersionType } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  data: {
    ...DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
    commitMessage: MOCK_COMMIT_MESSAGE,
    commitDescription: MOCK_COMMIT_DESCRIPTION,
    code: MOCK_CODE_SAMPLE,
  },
};

export const MOCK_DIFF_VIEW_SETTINGS: AppSetting & { data: DiffViewSettings } =
  {
    ...EMPTY_SETTING,
    id: v4(),
    name: DIFF_VIEW_SETTINGS_NAME,
    data: {
      ...DEFAULT_DIFF_VIEW_SETTINGS,
      oldCode: MOCK_DIFF_OLD_CODE,
      newCode: MOCK_DIFF_NEW_CODE,
    },
  };

export const MOCK_CHATBOT_PROMPT_SETTINGS_INPUT: AppSetting & {
  data: ChatbotPromptSettings;
} = {
  ...EMPTY_SETTING,
  id: v4(),
  name: CHATBOT_PROMPT_SETTINGS_NAME,
  data: {
    ...DEFAULT_CHATBOT_PROMPT_SETTINGS,
    initialPrompt:
      'My initial prompt is here - I am a bot that can have an initial prompt',
    chatbotPrompt: 'Biip boop hello i am a chatbot',
    lineNumber: 1,
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
    item: MOCK_SERVER_ITEM,
    creator: MEMBERS.BOB,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
