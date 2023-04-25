import { AppData } from '@graasp/apps-query-client';

import { APP_DATA_TYPES } from '../config/appDataTypes';

export type LiveCodeData = {
  code: string;
};

export interface LiveCodeAppData {
  data: LiveCodeData;
  type: APP_DATA_TYPES.LIVE_CODE;
}
export type LiveCodeType = AppData & LiveCodeAppData;
