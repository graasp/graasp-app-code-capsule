import { List } from 'immutable';

import { FC, ReactElement, createContext, useContext, useMemo } from 'react';

import { AppSetting } from '@graasp/apps-query-client';

import {
  APP_MODE_SETTINGS_NAME,
  CODE_EXECUTION_SETTINGS_NAME,
  DATA_FILE_LIST_SETTINGS_NAME,
  DATA_FILE_SETTINGS_NAME,
  GENERAL_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../../config/appSettingsTypes';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_CODE_EXECUTION_SETTINGS,
  DEFAULT_DATA_FILE_LIST_SETTINGS,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../../config/settings';
import {
  AppModeSettings,
  CodeExecutionSettings,
  DataFileListSettings,
  GeneralSettings,
  InstructorCodeVersionSettings,
} from '../../interfaces/settings';
import Loader from '../common/Loader';

// mapping between Setting names and their data type
interface AllSettingsType {
  [GENERAL_SETTINGS_NAME]?: GeneralSettings;
  [CODE_EXECUTION_SETTINGS_NAME]?: CodeExecutionSettings;
  [INSTRUCTOR_CODE_VERSION_SETTINGS_NAME]?: InstructorCodeVersionSettings;
  [APP_MODE_SETTINGS_NAME]?: AppModeSettings;
  [DATA_FILE_LIST_SETTINGS_NAME]?: DataFileListSettings;
}

// default values for the data property of settings by name
const defaultSettingsValues: AllSettingsType = {
  [GENERAL_SETTINGS_NAME]: DEFAULT_GENERAL_SETTINGS,
  [CODE_EXECUTION_SETTINGS_NAME]: DEFAULT_CODE_EXECUTION_SETTINGS,
  [INSTRUCTOR_CODE_VERSION_SETTINGS_NAME]:
    DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
  [APP_MODE_SETTINGS_NAME]: DEFAULT_APP_MODE_SETTINGS,
  [DATA_FILE_LIST_SETTINGS_NAME]: DEFAULT_DATA_FILE_LIST_SETTINGS,
};

// list of the settings names
const ALL_SETTING_NAMES = [
  GENERAL_SETTINGS_NAME,
  CODE_EXECUTION_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  APP_MODE_SETTINGS_NAME,
  DATA_FILE_LIST_SETTINGS_NAME,
] as const;

// automatically generated types
type AllSettingsNameType = typeof ALL_SETTING_NAMES[number];
type AllSettingsDataType = AllSettingsType[keyof AllSettingsType];

export type SettingsContextType = AllSettingsType & {
  dataFileSettings: List<AppSetting>;
  saveSettings: (
    name: AllSettingsNameType,
    newValue: AllSettingsDataType,
  ) => void;
};

const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettingsValues,
  dataFileSettings: List(),
  saveSettings: () => null,
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

  const contextValue = useMemo(() => {
    const allSettings: AllSettingsType = ALL_SETTING_NAMES.reduce(
      <T extends AllSettingsNameType>(acc: AllSettingsType, key: T) => {
        const setting = appSettings.data?.find((s) => s.name === key);
        const settingData = setting?.data;
        acc[key] = settingData as AllSettingsType[T];
        return acc;
      },
      {},
    );
    const dataFileSettings =
      appSettings.data?.filter((s) =>
        s.name.startsWith(DATA_FILE_SETTINGS_NAME),
      ) || List<AppSetting>();

    return {
      ...allSettings,
      dataFileSettings,
      saveSettings: (
        name: AllSettingsNameType,
        newValue: AllSettingsDataType,
      ) => {
        const previousSetting = appSettings.data?.find((s) => s.name === name);
        // generalSettings do not exist
        if (!previousSetting) {
          postSettings.mutate({
            data: newValue,
            name,
          });
        } else {
          patchSettings.mutate({
            id: previousSetting.id,
            data: newValue,
          });
        }
      },
    };
  }, [appSettings.data, patchSettings, postSettings]);

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
