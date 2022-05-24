import { PYTHON } from '../config/constants';

export interface GeneralSettings {
  showHeader: boolean;
  programmingLanguage: string;
  code: string;
}

export const DEFAULT_SHOW_HEADER_SETTING = false;
export const DEFAULT_PROGRAMMING_LANGUAGE_SETTING = PYTHON;
export const DEFAULT_CODE_SETTING = '';

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  showHeader: DEFAULT_SHOW_HEADER_SETTING,
  programmingLanguage: DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
  code: DEFAULT_CODE_SETTING,
};
