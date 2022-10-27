import isEqual from 'lodash.isequal';

import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FormLabel, Stack } from '@mui/material';

import {
  AppMode,
  CODE_EXECUTION_SETTINGS_NAME,
  EXECUTION_MODE_SETTINGS_KEY,
  REVIEW_MODE_SETTINGS_KEY,
} from '../../../../config/appSettingsTypes';
import {
  SETTING_FOOTER_CODE_EDITOR_CY,
  SETTING_HEADER_CODE_EDITOR_CY,
  SETTING_MAIN_CODE_EDITOR_CY,
} from '../../../../config/selectors';
import { DEFAULT_CODE_EXECUTION_SETTINGS } from '../../../../config/settings';
import { CodeExecutionSettingsKeys } from '../../../../interfaces/settings';
import SubmitButtons from '../../../common/settings/SubmitButtons';
import { useAppMode } from '../../../context/AppModeContext';
import { useSettings } from '../../../context/SettingsContext';
import CodeEditor from '../../../repl/CodeEditor';
import AppModeSelect from './AppModeSelect';

const SettingKeyForAppMode: { [key: string]: string } = {
  [AppMode.Execute]: EXECUTION_MODE_SETTINGS_KEY,
  [AppMode.Review]: REVIEW_MODE_SETTINGS_KEY,
};

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const { appMode } = useAppMode();
  const {
    [CODE_EXECUTION_SETTINGS_NAME]:
      codeExecSettings = DEFAULT_CODE_EXECUTION_SETTINGS,
    saveSettings,
  } = useSettings();
  const [localCodeExecSettings, setLocalCodeExecSettings] =
    useState(codeExecSettings);

  const [mainCode, setMainCode] = useState('');

  useEffect(
    () => setLocalCodeExecSettings(codeExecSettings),
    [codeExecSettings],
  );

  const unsavedCodeExecChanges = !isEqual(
    localCodeExecSettings,
    codeExecSettings,
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
      <AppModeSelect />
      {appMode === AppMode.Execute && (
        <Stack>
          <FormLabel>{t('Header code')}</FormLabel>
          <CodeEditor
            id={SETTING_HEADER_CODE_EDITOR_CY}
            value={localCodeExecSettings[CodeExecutionSettingsKeys.HeaderCode]}
            setValue={(value: string) =>
              changeCodeExecutionSetting(
                CodeExecutionSettingsKeys.HeaderCode,
                value,
              )
            }
          />
          <FormLabel>{t('Footer code')}</FormLabel>
          <CodeEditor
            id={SETTING_FOOTER_CODE_EDITOR_CY}
            value={localCodeExecSettings[CodeExecutionSettingsKeys.FooterCode]}
            setValue={(value: string) =>
              changeCodeExecutionSetting(
                CodeExecutionSettingsKeys.FooterCode,
                value,
              )
            }
          />
          <SubmitButtons
            onCancel={() => null}
            onSave={() =>
              saveSettings(CODE_EXECUTION_SETTINGS_NAME, {
                ...localCodeExecSettings,
                appMode,
              })
            }
            settingKey={SettingKeyForAppMode[appMode]}
            unsavedChanges={unsavedCodeExecChanges}
          />
        </Stack>
      )}
      {appMode === AppMode.Review && (
        <Stack>
          <FormLabel>{t('Code to review')}</FormLabel>
          <CodeEditor
            id={SETTING_MAIN_CODE_EDITOR_CY}
            value={mainCode}
            setValue={setMainCode}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default SettingsView;
