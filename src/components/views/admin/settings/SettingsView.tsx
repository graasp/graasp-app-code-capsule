import isEqual from 'lodash.isequal';

import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';

import {
  APP_MODE_SETTINGS_NAME,
  AppMode,
  CODE_EXECUTION_SETTINGS_NAME,
  EXECUTION_MODE_SETTINGS_KEY,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  REVIEW_MODE_SETTINGS_KEY,
} from '../../../../config/appSettingsTypes';
import {
  APP_MODE_COLLABORATE_BUTTON_CY,
  APP_MODE_EXECUTE_BUTTON_CY,
  APP_MODE_REVIEW_BUTTON_CY,
  SETTING_APP_MODE_SELECT_FORM_LABEL_CY,
  SETTING_APP_MODE_SELECT_NAME_CY,
  SETTING_FOOTER_CODE_EDITOR_CY,
  SETTING_HEADER_CODE_EDITOR_CY,
  SETTING_MAIN_CODE_EDITOR_CY,
} from '../../../../config/selectors';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_CODE_EXECUTION_SETTINGS,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../../../../config/settings';
import {
  AppModeSettingsKeys,
  CodeExecutionSettingsKeys,
  InstructorCodeSettingsKeys,
} from '../../../../interfaces/settings';
import SubmitButtons from '../../../common/settings/SubmitButtons';
import { useSettings } from '../../../context/SettingsContext';
import CodeEditor from '../../../repl/CodeEditor';
import DataFileUpload from './DataFileUpload';

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const {
    [CODE_EXECUTION_SETTINGS_NAME]:
      codeExecSettings = DEFAULT_CODE_EXECUTION_SETTINGS,
    [APP_MODE_SETTINGS_NAME]: appModeSetting = DEFAULT_APP_MODE_SETTINGS,
    [INSTRUCTOR_CODE_VERSION_SETTINGS_NAME]:
      instructorCodeVersionSetting = DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
    saveSettings,
  } = useSettings();
  const [localCodeExecSettings, setLocalCodeExecSettings] =
    useState(codeExecSettings);

  const [
    instructorCodeVersionLocalSetting,
    setInstructorCodeVersionLocalSetting,
  ] = useState(instructorCodeVersionSetting);
  const [appModeLocalSetting, setAppModeLocalSetting] =
    useState(appModeSetting);

  // update codeExecLocalSettings when setting changes
  useEffect(
    () => setLocalCodeExecSettings(codeExecSettings),
    [codeExecSettings],
  );

  // update instructorCodeVersionLocalSetting value when setting changes
  useEffect(
    () => setInstructorCodeVersionLocalSetting(instructorCodeVersionSetting),
    [instructorCodeVersionSetting],
  );

  // update appMode value when setting changes
  useEffect(() => setAppModeLocalSetting(appModeSetting), [appModeSetting]);

  const unsavedCodeExecChanges = !isEqual(
    localCodeExecSettings,
    codeExecSettings,
  );
  const unsavedInstructorCodeVersionChanges = !isEqual(
    instructorCodeVersionLocalSetting,
    instructorCodeVersionSetting,
  );

  const changeCodeExecutionSetting = (
    settingKey: string,
    newValue: string,
  ): void =>
    setLocalCodeExecSettings({
      ...localCodeExecSettings,
      [settingKey]: newValue,
    });

  return (
    <Stack>
      <FormControl>
        <FormLabel id={SETTING_APP_MODE_SELECT_FORM_LABEL_CY}>
          {t('Choose the App Mode')}
        </FormLabel>
        <RadioGroup
          aria-labelledby={SETTING_APP_MODE_SELECT_FORM_LABEL_CY}
          value={appModeLocalSetting[AppModeSettingsKeys.Mode]}
          onChange={(_, newAppMode) =>
            saveSettings(APP_MODE_SETTINGS_NAME, {
              ...appModeLocalSetting,
              [AppModeSettingsKeys.Mode]: newAppMode as AppMode,
            })
          }
          name={SETTING_APP_MODE_SELECT_NAME_CY}
          row
        >
          <FormControlLabel
            data-cy={APP_MODE_EXECUTE_BUTTON_CY}
            value={AppMode.Execute}
            control={<Radio />}
            label={AppMode.Execute}
          />
          <FormControlLabel
            data-cy={APP_MODE_REVIEW_BUTTON_CY}
            value={AppMode.Review}
            control={<Radio />}
            label={AppMode.Review}
          />
          <FormControlLabel
            data-cy={APP_MODE_COLLABORATE_BUTTON_CY}
            value={AppMode.Collaborate}
            control={<Radio />}
            label={AppMode.Collaborate}
          />
        </RadioGroup>
      </FormControl>
      {appModeLocalSetting[AppModeSettingsKeys.Mode] === AppMode.Execute && (
        <Stack spacing={1}>
          <Box>
            <FormLabel>{t('Header code')}</FormLabel>
            <CodeEditor
              id={SETTING_HEADER_CODE_EDITOR_CY}
              value={
                localCodeExecSettings[CodeExecutionSettingsKeys.HeaderCode]
              }
              setValue={(value: string) =>
                changeCodeExecutionSetting(
                  CodeExecutionSettingsKeys.HeaderCode,
                  value,
                )
              }
            />
          </Box>
          <Box>
            <FormLabel>{t('Footer code')}</FormLabel>
            <CodeEditor
              id={SETTING_FOOTER_CODE_EDITOR_CY}
              value={
                localCodeExecSettings[CodeExecutionSettingsKeys.FooterCode]
              }
              setValue={(value: string) =>
                changeCodeExecutionSetting(
                  CodeExecutionSettingsKeys.FooterCode,
                  value,
                )
              }
            />
          </Box>
          <Box>
            <FormLabel>{t('Data files')}</FormLabel>
            <DataFileUpload />
          </Box>
          <SubmitButtons
            onCancel={() => setLocalCodeExecSettings(codeExecSettings)}
            onSave={() =>
              saveSettings(CODE_EXECUTION_SETTINGS_NAME, localCodeExecSettings)
            }
            settingKey={EXECUTION_MODE_SETTINGS_KEY}
            unsavedChanges={unsavedCodeExecChanges}
          />
        </Stack>
      )}
      {appModeLocalSetting[AppModeSettingsKeys.Mode] === AppMode.Review && (
        <Stack>
          <FormLabel>{t('Code to review')}</FormLabel>
          <CodeEditor
            id={SETTING_MAIN_CODE_EDITOR_CY}
            value={
              instructorCodeVersionLocalSetting[InstructorCodeSettingsKeys.Code]
            }
            setValue={(newValue) =>
              setInstructorCodeVersionLocalSetting((prevSetting) => ({
                ...prevSetting,
                [InstructorCodeSettingsKeys.Code]: newValue,
              }))
            }
          />
          <SubmitButtons
            onCancel={() =>
              setInstructorCodeVersionLocalSetting(instructorCodeVersionSetting)
            }
            onSave={() =>
              saveSettings(
                INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
                instructorCodeVersionLocalSetting,
              )
            }
            settingKey={REVIEW_MODE_SETTINGS_KEY}
            unsavedChanges={unsavedInstructorCodeVersionChanges}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default SettingsView;
