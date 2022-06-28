import { AppData, AppSetting } from '@graasp/apps-query-client';

import { APP_DATA_TYPES } from '../config/appDataTypes';

export type CodeVersionType = {
  code: string;
  language: string;
  commitMessage: string;
  commitDescription: string;
};

export type CodeVersionSelectType = {
  id: string;
  data: CodeVersionType;
  creator: string;
  updatedAt: string;
};

export interface CodeAppData {
  data: CodeVersionType;
  type: APP_DATA_TYPES.CODE;
}

export type CodeType =
  | (AppData & CodeAppData)
  | ({ data: CodeVersionType } & AppSetting);
