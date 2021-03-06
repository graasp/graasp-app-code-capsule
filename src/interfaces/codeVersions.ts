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

// stripped out version of a code Resource but without the AppData properties like id, creator ...
export type CodeType =
  | (AppData & CodeAppData)
  | ({ data: CodeVersionType } & AppSetting);
