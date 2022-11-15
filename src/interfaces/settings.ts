import { AppMode, DataFile } from '../config/appSettingsTypes';

// general settings keys
export enum GeneralSettingsKeys {
  ShowHeader = 'showHeader',
  ShowToolbar = 'showToolbar',
  ShowVersionNavigation = 'showVersionNavigation',
  ShowEditButton = 'showEditButton',
  ShowRunButton = 'showRunButton',
  ShowVisibilityButton = 'showVisibilityButton',
  AllowComments = 'allowComments',
  AllowReplies = 'allowReplies',
  AllowCommentsReporting = 'allowCommentReporting',
  ReviewMode = 'reviewMode',
}

// Code Execution settings keys
export enum InstructorCodeSettingsKeys {
  Code = 'code',
  Language = 'language',
  CommitMessage = 'commitMessage',
  CommitDescription = 'commitDescription',
}

// Code Execution settings keys
export enum CodeExecutionSettingsKeys {
  HeaderCode = 'headerCode',
  FooterCode = 'footerCode',
  PreLoadedLibraries = 'preLoadedLibs',
}

// App Mode Setting keys
export enum AppModeSettingsKeys {
  Mode = 'mode',
}

// App Mode Setting keys
export enum DataFileListSettingsKeys {
  Files = 'files',
}

// type of general settings
export type GeneralSettings = {
  [GeneralSettingsKeys.ShowHeader]: boolean;
  [GeneralSettingsKeys.ShowToolbar]: boolean;
  [GeneralSettingsKeys.ShowVersionNavigation]: boolean;
  [GeneralSettingsKeys.ShowEditButton]: boolean;
  [GeneralSettingsKeys.ShowRunButton]: boolean;
  [GeneralSettingsKeys.ShowVisibilityButton]: boolean;
  [GeneralSettingsKeys.AllowComments]: boolean;
  [GeneralSettingsKeys.AllowReplies]: boolean;
  [GeneralSettingsKeys.AllowCommentsReporting]: boolean;
  [GeneralSettingsKeys.ReviewMode]: string;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type InstructorCodeVersionSettings = {
  [InstructorCodeSettingsKeys.Code]: string;
  [InstructorCodeSettingsKeys.Language]: string;
  [InstructorCodeSettingsKeys.CommitMessage]: string;
  [InstructorCodeSettingsKeys.CommitDescription]: string;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type CodeExecutionSettings = {
  [CodeExecutionSettingsKeys.HeaderCode]: string;
  [CodeExecutionSettingsKeys.FooterCode]: string;
  [CodeExecutionSettingsKeys.PreLoadedLibraries]: string;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type AppModeSettings = {
  [AppModeSettingsKeys.Mode]: AppMode;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type DataFileListSettings = {
  [DataFileListSettingsKeys.Files]: DataFile[];

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};
