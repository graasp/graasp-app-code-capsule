import {
  AppAction,
  AppData,
  AppSetting,
} from '@graasp/apps-query-client/dist/src/types';
import { Member } from './member';

export interface Database {
  appData: AppData[];
  appActions: AppAction[];
  appSettings: AppSetting[];
  members: Member[];
}
