import { AppData } from '@graasp/apps-query-client';

import { APP_DATA_TYPES, APP_DATA_VISIBILITY } from '../config/appDataTypes';

export type LiveCodeData = {
  code: string;
};

export interface LiveCodeAppData {
  data: LiveCodeData;
  type: APP_DATA_TYPES.LIVE_CODE;
  visibility?: APP_DATA_VISIBILITY.ITEM;
}
export type LiveCodeType = AppData & LiveCodeAppData;
