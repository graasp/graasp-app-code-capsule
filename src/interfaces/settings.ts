import { AppMode } from '../config/appSettingsTypes';

// general settings keys
export enum SETTINGS_KEYS {
  SHOW_HEADER = 'showHeader',
  SHOW_TOOLBAR = 'showToolbar',
  SHOW_VERSION_NAVIGATION = 'showVersionNavigation',
  SHOW_EDIT_BUTTON = 'showEditButton',
  SHOW_VISIBILITY_BUTTON = 'showVisibilityButton',
  ALLOW_COMMENTS = 'allowComments',
  ALLOW_REPLIES = 'allowReplies',
  ALLOW_COMMENT_REPORTING = 'allowCommentReporting',
  REVIEW_MODE = 'reviewMode',
}

// Code Execution settings keys
export enum CodeExecutionSettingsKeys {
  HeaderCode = 'header_code',
  FooterCode = 'footer_code',
}

// App Mode Setting keys
export enum AppModeSettingsKeys {
  Mode = 'mode',
}

// type of general settings
export type GeneralSettings = {
  [SETTINGS_KEYS.SHOW_HEADER]: boolean;
  [SETTINGS_KEYS.SHOW_TOOLBAR]: boolean;
  [SETTINGS_KEYS.SHOW_VERSION_NAVIGATION]: boolean;
  [SETTINGS_KEYS.SHOW_EDIT_BUTTON]: boolean;
  [SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON]: boolean;
  [SETTINGS_KEYS.ALLOW_COMMENTS]: boolean;
  [SETTINGS_KEYS.ALLOW_REPLIES]: boolean;
  [SETTINGS_KEYS.ALLOW_COMMENT_REPORTING]: boolean;
  [SETTINGS_KEYS.REVIEW_MODE]: string;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type CodeVersionSettings = {
  [SETTINGS_KEYS.SHOW_HEADER]: boolean;
  [SETTINGS_KEYS.SHOW_TOOLBAR]: boolean;
  [SETTINGS_KEYS.SHOW_VERSION_NAVIGATION]: boolean;
  [SETTINGS_KEYS.SHOW_EDIT_BUTTON]: boolean;
  [SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON]: boolean;
  [SETTINGS_KEYS.ALLOW_COMMENTS]: boolean;
  [SETTINGS_KEYS.ALLOW_REPLIES]: boolean;
  [SETTINGS_KEYS.REVIEW_MODE]: string;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type CodeExecutionSettings = {
  [CodeExecutionSettingsKeys.HeaderCode]: string;
  [CodeExecutionSettingsKeys.FooterCode]: string;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type AppModeSetting = {
  [AppModeSettingsKeys.Mode]: AppMode;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};
