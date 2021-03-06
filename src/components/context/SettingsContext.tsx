import isEqual from 'lodash.isequal';

import React, {
  FC,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AppSetting } from '@graasp/apps-query-client';

import { GENERAL_SETTINGS_KEY } from '../../config/appSettingsTypes';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import { DEFAULT_GENERAL_SETTINGS } from '../../config/settings';
import { GeneralSettings } from '../../interfaces/settings';
import Loader from '../common/Loader';

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
  const appSettings = hooks.useAppSettings();
  const [settings, setSettings] = useState(DEFAULT_GENERAL_SETTINGS);

  useEffect(
    () => {
      if (appSettings.data) {
        const generalAppSettings = appSettings.data?.find(
          (setting) => setting.name === GENERAL_SETTINGS_KEY,
        )?.data as GeneralSettings;
        if (generalAppSettings && !isEqual(settings, generalAppSettings)) {
          setSettings(generalAppSettings);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appSettings.data],
  );

  const contextValue = useMemo(() => {
    const generalSettings = appSettings.data?.find(
      (s) => s.name === GENERAL_SETTINGS_KEY,
    );
    return {
      settings,
      changeSetting: (key: string, value: unknown): void => {
        setSettings({
          ...settings,
          [key]: value,
        });
      },
      saveSettings: () => {
        // generalSettings do not exist
        if (!generalSettings) {
          postSettings.mutate({
            data: settings,
            name: GENERAL_SETTINGS_KEY,
          });
        } else {
          patchSettings.mutate({
            id: generalSettings.id,
            data: settings,
          });
        }
      },
      resetSettings: () =>
        setSettings(
          (generalSettings?.data as GeneralSettings) ??
            DEFAULT_GENERAL_SETTINGS,
        ),
      unsavedChanges: !isEqual(generalSettings?.data, settings),
    };
  }, [appSettings.data, patchSettings, postSettings, settings]);

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
