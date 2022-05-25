import {
  AppAction,
  AppData,
  AppSetting,
  Member,
} from '@graasp/apps-query-client/dist/src/types';

export interface Database {
  appData: AppData[];
  appActions: AppAction[];
  appSettings: AppSetting[];
  members: Member[];
}
