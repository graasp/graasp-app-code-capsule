import { PYTHON } from '../config/constants';

// general settings keys
export enum SETTINGS {
  SHOW_HEADER = 'showHeader',
  SHOW_TOOLBAR = 'showToolbar',
  SHOW_VERSION_NAVIGATION = 'showVersionNavigation',
  SHOW_EDIT_BUTTON = 'showEditButton',
  SHOW_VISIBILITY_BUTTON = 'showVisibilityButton',
  ALLOW_COMMENTS = 'allowComments',
  ALLOW_REPLIES = 'allowReplies',
  PROGRAMMING_LANGUAGE = 'programmingLanguage',
  CODE = 'code',
}

// type of general settings
export interface GeneralSettings {
  [SETTINGS.SHOW_HEADER]: boolean;
  [SETTINGS.SHOW_TOOLBAR]: boolean;
  [SETTINGS.SHOW_VERSION_NAVIGATION]: boolean;
  [SETTINGS.SHOW_EDIT_BUTTON]: boolean;
  [SETTINGS.SHOW_VISIBILITY_BUTTON]: boolean;
  [SETTINGS.ALLOW_COMMENTS]: boolean;
  [SETTINGS.ALLOW_REPLIES]: boolean;
  [SETTINGS.PROGRAMMING_LANGUAGE]: string;
  [SETTINGS.CODE]: string;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
}

// default values
export const DEFAULT_SHOW_HEADER_SETTING = false;
export const DEFAULT_SHOW_TOOLBAR_SETTING = true;
export const DEFAULT_SHOW_VERSION_NAVIGATION_SETTING = false;
export const DEFAULT_SHOW_EDIT_BUTTON_SETTING = false;
export const DEFAULT_SHOW_VISIBILITY_BUTTON_SETTING = true;
export const DEFAULT_ALLOW_COMMENTS_SETTING = true;
export const DEFAULT_ALLOW_REPLIES_SETTING = true;
export const DEFAULT_PROGRAMMING_LANGUAGE_SETTING = PYTHON;
export const DEFAULT_CODE_SETTING = `# my sample code in python

age = input('What is your age ?')
print(f'Your age is {age}')

# ask another question
print('wait a bit')
''' and here starts a
multiline comment 
that continues here also
'''
for i in range(10000):
    pass

print('Done!')
print('See you !')
`;

// default settings object
export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  [SETTINGS.SHOW_HEADER]: DEFAULT_SHOW_HEADER_SETTING,
  [SETTINGS.SHOW_TOOLBAR]: DEFAULT_SHOW_TOOLBAR_SETTING,
  [SETTINGS.SHOW_VERSION_NAVIGATION]: DEFAULT_SHOW_VERSION_NAVIGATION_SETTING,
  [SETTINGS.SHOW_EDIT_BUTTON]: DEFAULT_SHOW_EDIT_BUTTON_SETTING,
  [SETTINGS.SHOW_VISIBILITY_BUTTON]: DEFAULT_SHOW_VISIBILITY_BUTTON_SETTING,
  [SETTINGS.ALLOW_COMMENTS]: DEFAULT_ALLOW_COMMENTS_SETTING,
  [SETTINGS.ALLOW_REPLIES]: DEFAULT_ALLOW_REPLIES_SETTING,
  [SETTINGS.PROGRAMMING_LANGUAGE]: DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
  [SETTINGS.CODE]: DEFAULT_CODE_SETTING,
};
