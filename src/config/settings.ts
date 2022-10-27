import { Context, PermissionLevel } from '@graasp/sdk';

import {
  AppModeSetting,
  AppModeSettingsKeys,
  CodeExecutionSettings,
  CodeExecutionSettingsKeys,
  GeneralSettings,
  SETTINGS_KEYS,
} from '../interfaces/settings';
import { AppMode } from './appSettingsTypes';
import { PYTHON, REVIEW_MODE_INDIVIDUAL } from './constants';
import { REACT_APP_MOCK_API } from './env';
import { AppView } from './layout';

export const MOCK_API = REACT_APP_MOCK_API === 'true';
export const DEFAULT_APP_MODE = AppMode.Execute;
export const DEFAULT_APP_VIEW = AppView;

export const DEFAULT_CONTEXT = Context.BUILDER;
export const DEFAULT_PERMISSION = PermissionLevel.Read;
export const DEFAULT_LINE_HIDDEN_STATE = false;

export const DEFAULT_CONTEXT_API_HOST = '';
export const DEFAULT_CONTEXT_ITEM_ID = '';
export const DEFAULT_CONTEXT_LANGUAGE = 'en';
export const DEFAULT_CONTEXT_STANDALONE = false;
export const DEFAULT_CONTEXT_OFFLINE = false;
export const DEFAULT_CONTEXT_DEV = false;
export const DEFAULT_CONTEXT_SETTINGS = {};

// default values
export const DEFAULT_SHOW_HEADER_SETTING = false;
export const DEFAULT_SHOW_TOOLBAR_SETTING = true;
export const DEFAULT_SHOW_VERSION_NAVIGATION_SETTING = false;
export const DEFAULT_SHOW_EDIT_BUTTON_SETTING = false;
export const DEFAULT_SHOW_VISIBILITY_BUTTON_SETTING = true;
export const DEFAULT_ALLOW_COMMENTS_SETTING = true;
export const DEFAULT_ALLOW_REPLIES_SETTING = true;
export const DEFAULT_ALLOW_COMMENT_REPORTING = true;
export const DEFAULT_PROGRAMMING_LANGUAGE_SETTING = PYTHON;
export const DEFAULT_CODE_SETTING = '';
export const DEFAULT_COMMIT_MESSAGE_SETTING = '';
export const DEFAULT_COMMIT_DESCRIPTION_SETTING = '';

export const DEFAULT_REVIEW_MODE_SETTING = REVIEW_MODE_INDIVIDUAL;

// default settings object
export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  [SETTINGS_KEYS.SHOW_HEADER]: DEFAULT_SHOW_HEADER_SETTING,
  [SETTINGS_KEYS.SHOW_TOOLBAR]: DEFAULT_SHOW_TOOLBAR_SETTING,
  [SETTINGS_KEYS.SHOW_VERSION_NAVIGATION]:
    DEFAULT_SHOW_VERSION_NAVIGATION_SETTING,
  [SETTINGS_KEYS.SHOW_EDIT_BUTTON]: DEFAULT_SHOW_EDIT_BUTTON_SETTING,
  [SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON]:
    DEFAULT_SHOW_VISIBILITY_BUTTON_SETTING,
  [SETTINGS_KEYS.ALLOW_COMMENTS]: DEFAULT_ALLOW_COMMENTS_SETTING,
  [SETTINGS_KEYS.ALLOW_REPLIES]: DEFAULT_ALLOW_REPLIES_SETTING,
  [SETTINGS_KEYS.ALLOW_COMMENT_REPORTING]: DEFAULT_ALLOW_COMMENT_REPORTING,
  [SETTINGS_KEYS.REVIEW_MODE]: DEFAULT_REVIEW_MODE_SETTING,
};

// code Execution settings
export const DEFAULT_CODE_EXECUTION_SETTINGS: CodeExecutionSettings = {
  [CodeExecutionSettingsKeys.HeaderCode]: '',
  [CodeExecutionSettingsKeys.FooterCode]: '',
};

// app mode setting
export const DEFAULT_APP_MODE_SETTING: AppModeSetting = {
  [AppModeSettingsKeys.Mode]: DEFAULT_APP_MODE,
};
