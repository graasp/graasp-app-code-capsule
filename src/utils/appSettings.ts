import { AppSetting } from '@graasp/apps-query-client/dist/src/types';
import { List } from 'immutable';
import { useAppSettings } from '../components/context/hooks';
import {
  DEFAULT_GENERAL_SETTINGS,
  GeneralSettings,
} from '../interfaces/settings';
import { GENERAL_SETTINGS_KEY } from '../config/appSettings';

export const useGeneralAppSettings = ():
  | GeneralSettings
  | { [key: string]: unknown }
  | undefined => {
  const { data, isLoading, isError, error } = useAppSettings();
  if (isLoading) {
    return undefined;
  }
  if (isError) {
    // eslint-disable-next-line no-console
    console.error('GeneralAppSettings', error);
  }

  const appSettings = data as List<AppSetting>;
  const generalSetting = appSettings?.find(
    (setting: AppSetting) => setting.name === GENERAL_SETTINGS_KEY,
  )?.data;

  return generalSetting || DEFAULT_GENERAL_SETTINGS;
};
