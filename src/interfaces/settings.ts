import type { AppSetting } from '@graasp/sdk';

import { ProgrammingLanguagesType } from '@/config/programmingLanguages';

import { AppMode, DataFile } from '../config/appSettingsTypes';

// general settings keys
export enum GeneralSettingsKeys {
  ShowHeader = 'showHeader',
  ShowToolbar = 'showToolbar',
  ShowVersionNavigation = 'showVersionNavigation',
  ShowEditButton = 'showEditButton',
  ShowRunButton = 'showRunButton',
  ShowVisibilityButton = 'showVisibilityButton',
  ShowLineNumbers = 'showLineNumbers',
  AllowComments = 'allowComments',
  AllowReplies = 'allowReplies',
  AllowCommentsReporting = 'allowCommentReporting',
  ReviewMode = 'reviewMode',
  MaxCommentLength = 'maxCommentLength',
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

// Diff View Setting keys
export enum DiffViewSettingsKeys {
  Language = 'language',
  OldCode = 'oldCode',
  NewCode = 'newCode',
  LinesOffset = 'linesOffset',
}

// Chatbot Prompt Setting keys
export enum ChatbotPromptSettingsKeys {
  InitialPrompt = 'initialPrompt',
  ChatbotPrompt = 'chatbotPrompt',
  LineNumber = 'lineNumber',
}

// type of general settings
export type GeneralSettings = {
  [GeneralSettingsKeys.ShowHeader]: boolean;
  [GeneralSettingsKeys.ShowToolbar]: boolean;
  [GeneralSettingsKeys.ShowVersionNavigation]: boolean;
  [GeneralSettingsKeys.ShowEditButton]: boolean;
  [GeneralSettingsKeys.ShowRunButton]: boolean;
  [GeneralSettingsKeys.ShowVisibilityButton]: boolean;
  [GeneralSettingsKeys.ShowLineNumbers]: boolean;
  [GeneralSettingsKeys.AllowComments]: boolean;
  [GeneralSettingsKeys.AllowReplies]: boolean;
  [GeneralSettingsKeys.AllowCommentsReporting]: boolean;
  [GeneralSettingsKeys.ReviewMode]: string;
  [GeneralSettingsKeys.MaxCommentLength]: number;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type InstructorCodeVersionSettings = {
  [InstructorCodeSettingsKeys.Code]: string;
  [InstructorCodeSettingsKeys.Language]: ProgrammingLanguagesType;
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

export type DiffViewSettings = {
  [DiffViewSettingsKeys.Language]: ProgrammingLanguagesType;
  [DiffViewSettingsKeys.OldCode]: string;
  [DiffViewSettingsKeys.NewCode]: string;
  [DiffViewSettingsKeys.LinesOffset]: number;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type ChatbotPromptSettings = {
  [ChatbotPromptSettingsKeys.InitialPrompt]: string;
  [ChatbotPromptSettingsKeys.ChatbotPrompt]: string;
  [ChatbotPromptSettingsKeys.LineNumber]: number;

  // used to allow access using settings[settingKey] syntax
  [key: string]: unknown;
};

export type ChatbotPromptAppSettings = AppSetting & {
  data: ChatbotPromptSettings;
};
