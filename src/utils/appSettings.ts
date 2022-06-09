import { AppSetting } from '@graasp/apps-query-client/dist/src/types';
import {
  DEFAULT_GENERAL_SETTINGS,
  GeneralSettings,
} from '../interfaces/settings';
import { GENERAL_SETTINGS_KEY } from '../config/appSettingsTypes';
import { hooks } from '../config/queryClient';

export const useGeneralAppSettings = ():
  | GeneralSettings
  | { [key: string]: unknown }
  | undefined => {
  const { data, isLoading, isError, error } = hooks.useAppSettings();
  if (isLoading) {
    return undefined;
  }
  if (isError) {
    // eslint-disable-next-line no-console
    console.error('GeneralAppSettings', error);
  }

  const generalSetting = data?.find(
    (setting: AppSetting) => setting.name === GENERAL_SETTINGS_KEY,
  )?.data;

  return generalSetting || DEFAULT_GENERAL_SETTINGS;
};
