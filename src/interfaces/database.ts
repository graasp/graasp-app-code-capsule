import {
  AppAction,
  AppData,
  AppSetting,
  Member,
} from '@graasp/apps-query-client';

export interface Database {
  appData: AppData[];
  appActions: AppAction[];
  appSettings: AppSetting[];
  members: Member[];
}
