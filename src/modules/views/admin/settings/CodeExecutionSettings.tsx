import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { InfoOutlined } from '@mui/icons-material';
import { Box, FormLabel, Stack, Tooltip, Typography } from '@mui/material';

import isEqual from 'lodash.isequal';

import { CODE_EXECUTION_SETTINGS_NAME } from '@/config/appSettingsTypes';
import { PYTHON } from '@/config/programmingLanguages';
import {
  EXECUTION_MODE_SETTINGS_KEY,
  SETTING_FOOTER_CODE_EDITOR_CY,
  SETTING_HEADER_CODE_EDITOR_CY,
} from '@/config/selectors';
import { DEFAULT_CODE_EXECUTION_SETTINGS } from '@/config/settings';
import { CodeExecutionSettingsKeys } from '@/interfaces/settings';
import SubmitButtons from '@/modules/common/settings/SubmitButtons';
import { useSettings } from '@/modules/context/SettingsContext';
import CodeEditor from '@/modules/repl/CodeEditor';

import DataFileUpload from './DataFileUpload';
import PreLoadedLibrariesInput from './PreLoadedLibrariesInput';

const CodeExecutionSettings = (): JSX.Element => {
  const { t } = useTranslation();

  const {
    [CODE_EXECUTION_SETTINGS_NAME]:
      codeExecSettings = DEFAULT_CODE_EXECUTION_SETTINGS,
    saveSettings,
  } = useSettings();

  const [localCodeExecSettings, setLocalCodeExecSettings] =
    useState(codeExecSettings);

  // update codeExecLocalSettings when setting changes
  useEffect(
    () => setLocalCodeExecSettings(codeExecSettings),
    [codeExecSettings],
  );

  const changeCodeExecutionSetting = (
    settingKey: string,
    newValue: string,
  ): void =>
    setLocalCodeExecSettings(localCodeExecSettings.set(settingKey, newValue));

  const unsavedCodeExecChanges = !isEqual(
    localCodeExecSettings,
    codeExecSettings,
  );

  return (
    <Stack spacing={1}>
      <Typography variant="caption">
        {t('EXECUTION_SUPPORTED_LANGUAGE_NOTICE', { language: PYTHON })}
      </Typography>
      <Box>
        <FormLabel>{t('Header code')}</FormLabel>
        <CodeEditor
          id={SETTING_HEADER_CODE_EDITOR_CY}
          languageSupport={[PYTHON]}
          value={localCodeExecSettings[CodeExecutionSettingsKeys.HeaderCode]}
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
          languageSupport={[PYTHON]}
          value={localCodeExecSettings[CodeExecutionSettingsKeys.FooterCode]}
          setValue={(value: string) =>
            changeCodeExecutionSetting(
              CodeExecutionSettingsKeys.FooterCode,
              value,
            )
          }
        />
      </Box>
      <Box>
        <FormLabel>
          <Stack direction="row" spacing={1}>
            <span>{t('Pre-loaded libraries')}</span>
            <Tooltip
              title={t('PRE_LOADED_LIBS_DESCRIPTION')}
              placement="right"
              arrow
            >
              <InfoOutlined color="primary" />
            </Tooltip>
          </Stack>
        </FormLabel>
        <PreLoadedLibrariesInput
          value={
            localCodeExecSettings[CodeExecutionSettingsKeys.PreLoadedLibraries]
          }
          setValue={(value: string) =>
            changeCodeExecutionSetting(
              CodeExecutionSettingsKeys.PreLoadedLibraries,
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
  );
};
export default CodeExecutionSettings;
