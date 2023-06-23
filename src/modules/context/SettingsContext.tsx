import { FC, ReactElement, createContext, useContext } from 'react';

import { AppSettingRecord } from '@graasp/sdk/frontend';

import { List } from 'immutable';

import {
  APP_MODE_SETTINGS_NAME,
  CHATBOT_PROMPT_SETTINGS_NAME,
  CODE_EXECUTION_SETTINGS_NAME,
  DATA_FILE_LIST_SETTINGS_NAME,
  DATA_FILE_SETTINGS_NAME,
  DIFF_VIEW_SETTINGS_NAME,
  GENERAL_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../../config/appSettingsTypes';
import { hooks, mutations } from '../../config/queryClient';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_CODE_EXECUTION_SETTINGS,
  DEFAULT_DATA_FILE_LIST_SETTINGS,
  DEFAULT_DIFF_VIEW_SETTINGS,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../../config/settings';
import {
  AppModeSettingsRecord,
  ChatbotPromptAppSettingRecord,
  CodeExecutionSettingsRecord,
  DataFileListSettingsRecord,
  DiffViewSettingsRecord,
  GeneralSettingsRecord,
  InstructorCodeVersionSettingsRecord,
} from '../../interfaces/settings';
import Loader from '../common/Loader';

// mapping between Setting names and their data type
interface AllSettingsTypeRecord {
  [GENERAL_SETTINGS_NAME]?: GeneralSettingsRecord;
  [CODE_EXECUTION_SETTINGS_NAME]?: CodeExecutionSettingsRecord;
  [INSTRUCTOR_CODE_VERSION_SETTINGS_NAME]?: InstructorCodeVersionSettingsRecord;
  [APP_MODE_SETTINGS_NAME]?: AppModeSettingsRecord;
  [DATA_FILE_LIST_SETTINGS_NAME]?: DataFileListSettingsRecord;
  [DIFF_VIEW_SETTINGS_NAME]?: DiffViewSettingsRecord;
}

// default values for the data property of settings by name
const defaultSettingsValues: AllSettingsTypeRecord = {
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
// eslint-disable-next-line prettier/prettier
type AllSettingsNameType = (typeof ALL_SETTING_NAMES)[number];
type AllSettingsDataTypeRecord =
  AllSettingsTypeRecord[keyof AllSettingsTypeRecord];

export type SettingsContextType = AllSettingsTypeRecord & {
  dataFileSettings: List<AppSettingRecord>;
  chatbotPrompts: List<ChatbotPromptAppSettingRecord>;
  saveSettings: (
    name: AllSettingsNameType,
    newValue: AllSettingsDataTypeRecord,
  ) => void;
};

const defaultContextValue = {
  ...defaultSettingsValues,
  dataFileSettings: List<AppSettingRecord>(),
  chatbotPrompts: List<ChatbotPromptAppSettingRecord>(),
  saveSettings: () => null,
};

const SettingsContext = createContext<SettingsContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const SettingsProvider: FC<Prop> = ({ children }) => {
  const postSettings = mutations.usePostAppSetting();
  const patchSettings = mutations.usePatchAppSetting();
  const {
    data: appSettingsList,
    isLoading,
    isSuccess,
  } = hooks.useAppSettings();

  const saveSettings = (
    name: AllSettingsNameType,
    newValue: AllSettingsDataTypeRecord,
  ): void => {
    if (appSettingsList) {
      const previousSetting = appSettingsList.find((s) => s.name === name);
      // setting does not exist
      if (!previousSetting) {
        postSettings.mutate({
          data: newValue?.toJS(),
          name,
        });
      } else {
        patchSettings.mutate({
          id: previousSetting.id,
          data: newValue?.toJS(),
        });
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const getContextValue = (): SettingsContextType => {
    if (isSuccess) {
      const allSettings: AllSettingsTypeRecord = ALL_SETTING_NAMES.reduce(
        <T extends AllSettingsNameType>(acc: AllSettingsTypeRecord, key: T) => {
          const setting = appSettingsList.find((s) => s.name === key);
          const settingData = setting?.data;
          acc[key] = settingData as AllSettingsTypeRecord[T];
          return acc;
        },
        {},
      );

      const dataFileSettings =
        appSettingsList.filter((s) =>
          s.name.startsWith(DATA_FILE_SETTINGS_NAME),
        ) || List<AppSettingRecord>();

      const chatbotPrompts =
        (appSettingsList.filter(
          (s) => s.name === CHATBOT_PROMPT_SETTINGS_NAME,
        ) as List<ChatbotPromptAppSettingRecord>) ||
        List<ChatbotPromptAppSettingRecord>();

      return {
        ...allSettings,
        dataFileSettings,
        chatbotPrompts,
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
