import React, {
  createContext,
  FC,
  ReactElement,
  useContext,
  useMemo,
  useState,
} from 'react';
import { AppSetting } from '@graasp/apps-query-client/dist/src/types';
import _ from 'lodash';
import Loader from '../common/Loader';
import {
  DEFAULT_GENERAL_SETTINGS,
  GeneralSettings,
} from '../../interfaces/settings';
import { GENERAL_SETTINGS_KEY } from '../../config/appSettingsTypes';
import { MUTATION_KEYS, useMutation, hooks } from '../../config/queryClient';

const { useAppSettings } = hooks;

export type SettingsContextType = {
  settings: GeneralSettings;
  changeSetting: (name: string, value: unknown) => void;
  saveSettings: () => void;
  resetSettings: () => void;
  unsavedChanges: boolean;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_GENERAL_SETTINGS,
  changeSetting: () => null,
  saveSettings: () => null,
  resetSettings: () => null,
  unsavedChanges: false,
});

type Prop = {
  children: ReactElement | ReactElement[];
};

export const SettingsProvider: FC<Prop> = ({ children }) => {
  const postSettings = useMutation<unknown, unknown, Partial<AppSetting>>(
    MUTATION_KEYS.POST_APP_SETTING,
  );
  const patchSettings = useMutation<unknown, unknown, Partial<AppSetting>>(
    MUTATION_KEYS.PATCH_APP_SETTING,
  );
  const appSettings = useAppSettings();
  const generalAppSettings = appSettings?.data?.find(
    (setting) => setting.name === GENERAL_SETTINGS_KEY,
  );
  const defaultSettingsValue =
    (generalAppSettings?.data as GeneralSettings) ?? DEFAULT_GENERAL_SETTINGS;
  const [settings, setSettings] = useState(defaultSettingsValue);

  const contextValue = useMemo(
    () => ({
      settings,
      changeSetting: (key: string, value: unknown): void => {
        setSettings({
          ...settings,
          [key]: value,
        });
      },
      saveSettings: () => {
        if (!generalAppSettings?.data) {
          postSettings.mutate({
            data: settings,
            name: GENERAL_SETTINGS_KEY,
          });
        } else {
          patchSettings.mutate({
            id: generalAppSettings?.id,
            data: settings,
          });
        }
      },
      resetSettings: () => setSettings(defaultSettingsValue),
      unsavedChanges: !_.isEqual(defaultSettingsValue, settings),
    }),
    [
      settings,
      defaultSettingsValue,
      generalAppSettings,
      postSettings,
      patchSettings,
    ],
  );

  if (appSettings.isLoading) {
    return <Loader />;
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType =>
  useContext<SettingsContextType>(SettingsContext);
