import { CodeVersionType } from '../interfaces/codeVersions';
import {
  DEFAULT_CODE_SETTING,
  DEFAULT_COMMIT_DESCRIPTION_SETTING,
  DEFAULT_COMMIT_MESSAGE_SETTING,
  DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
} from './settings';

export enum CodeContexts {
  Instructor,
  Student,
}

export const DEFAULT_CODE_VERSION_SETTING: CodeVersionType = {
  code: DEFAULT_CODE_SETTING,
  language: DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
  commitMessage: DEFAULT_COMMIT_MESSAGE_SETTING,
  commitDescription: DEFAULT_COMMIT_DESCRIPTION_SETTING,
};
