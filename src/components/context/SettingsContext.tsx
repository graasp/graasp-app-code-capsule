import { List } from 'immutable';

import { FC, ReactElement, createContext, useContext } from 'react';

import { AppSetting } from '@graasp/apps-query-client';

import {
  APP_MODE_SETTINGS_NAME,
  CODE_EXECUTION_SETTINGS_NAME,
  DATA_FILE_LIST_SETTINGS_NAME,
  DATA_FILE_SETTINGS_NAME,
  DIFF_VIEW_SETTINGS_NAME,
  GENERAL_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../../config/appSettingsTypes';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_CODE_EXECUTION_SETTINGS,
  DEFAULT_DATA_FILE_LIST_SETTINGS,
  DEFAULT_DIFF_VIEW_SETTINGS,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../../config/settings';
import {
  AppModeSettings,
  CodeExecutionSettings,
  DataFileListSettings,
  DiffViewSettings,
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
  [DIFF_VIEW_SETTINGS_NAME]?: DiffViewSettings;
}

// default values for the data property of settings by name
const defaultSettingsValues: AllSettingsType = {
  [GENERAL_SETTINGS_NAME]: DEFAULT_GENERAL_SETTINGS,
  [CODE_EXECUTION_SETTINGS_NAME]: DEFAULT_CODE_EXECUTION_SETTINGS,
  [INSTRUCTOR_CODE_VERSION_SETTINGS_NAME]:
    DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
  [APP_MODE_SETTINGS_NAME]: DEFAULT_APP_MODE_SETTINGS,
  [DATA_FILE_LIST_SETTINGS_NAME]: DEFAULT_DATA_FILE_LIST_SETTINGS,
  [DIFF_VIEW_SETTINGS_NAME]: DEFAULT_DIFF_VIEW_SETTINGS,
};

// list of the settings names
const ALL_SETTING_NAMES = [
  GENERAL_SETTINGS_NAME,
  CODE_EXECUTION_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  APP_MODE_SETTINGS_NAME,
  DATA_FILE_LIST_SETTINGS_NAME,
  DIFF_VIEW_SETTINGS_NAME,
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

const defaultContextValue = {
  ...defaultSettingsValues,
  dataFileSettings: List<AppSetting>(),
  saveSettings: () => null,
};

const SettingsContext = createContext<SettingsContextType>(defaultContextValue);

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
  const {
    data: appSettingsList,
    isLoading,
    isSuccess,
  } = hooks.useAppSettings();

  const saveSettings = (
    name: AllSettingsNameType,
    newValue: AllSettingsDataType,
  ): void => {
    if (appSettingsList) {
      const previousSetting = appSettingsList.find((s) => s.name === name);
      // setting does not exist
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
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const getContextValue = (): SettingsContextType => {
    if (isSuccess) {
      const allSettings: AllSettingsType = ALL_SETTING_NAMES.reduce(
        <T extends AllSettingsNameType>(acc: AllSettingsType, key: T) => {
          const setting = appSettingsList.find((s) => s.name === key);
          const settingData = setting?.data;
          acc[key] = settingData as AllSettingsType[T];
          return acc;
        },
        {},
      );
      const dataFileSettings =
        appSettingsList.filter((s) =>
          s.name.startsWith(DATA_FILE_SETTINGS_NAME),
        ) || List<AppSetting>();

      return {
        ...allSettings,
        dataFileSettings,
        saveSettings,
      };
    }
    return defaultContextValue;
  };

  const contextValue = getContextValue();

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType =>
  useContext<SettingsContextType>(SettingsContext);
