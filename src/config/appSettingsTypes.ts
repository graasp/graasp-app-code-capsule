export const GENERAL_SETTINGS_NAME = 'GENERAL_SETTINGS';
export const CODE_EXECUTION_SETTINGS_NAME = 'CODE_EXECUTION_SETTINGS';
export const APP_MODE_SETTINGS_NAME = 'APP_MODE_SETTINGS';
export const DATA_FILE_LIST_SETTINGS_NAME = 'DATA_FILE_LIST_SETTINGS';
export const INSTRUCTOR_CODE_VERSION_SETTINGS_NAME = 'INSTRUCTOR_CODE_VERSION';
export const DATA_FILE_SETTINGS_NAME = 'DATA_FILE_SETTING';

// app mode settings
export const EXECUTION_MODE_SETTINGS_KEY = 'EXECUTION_MODE_SETTINGS_KEY';
export const REVIEW_MODE_SETTINGS_KEY = 'REVIEW_MODE_SETTINGS_KEY';

export enum CodeEditorSubmitTarget {
  Settings,
  Code,
}

export enum AppMode {
  Execute = 'Execute',
  Review = 'Review',
  Collaborate = 'Collaborate',
}

export type DataFile = {
  settingName: string;
  virtualPath: string;
};
