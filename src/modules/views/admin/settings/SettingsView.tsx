import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, FormControl, Stack } from '@mui/material';

import { APP_MODE_SETTINGS_NAME, AppMode } from '@/config/appSettingsTypes';
import {
  APP_MODE_COLLABORATE_BUTTON_CY,
  APP_MODE_EXECUTE_BUTTON_CY,
  APP_MODE_EXPLAIN_BUTTON_CY,
  APP_MODE_REVIEW_BUTTON_CY,
  SETTING_APP_MODE_SELECT_NAME_CY,
} from '@/config/selectors';
import { DEFAULT_APP_MODE_SETTINGS } from '@/config/settings';
import { AppModeSettingsKeys } from '@/interfaces/settings';
import AppModeDescription from '@/modules/common/AppModeDescription';
import CustomSelect from '@/modules/layout/CustomSelect';

import { useSettings } from '../../../context/SettingsContext';
import CodeExecutionSettings from './CodeExecutionSettings';
import CodeExplainSettings from './CodeExplainSettings';
import CodeReviewSettings from './CodeReviewSettings';

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const {
    [APP_MODE_SETTINGS_NAME]: appModeSetting = DEFAULT_APP_MODE_SETTINGS,
    saveSettings,
  } = useSettings();

  const [appModeLocalSetting, setAppModeLocalSetting] =
    useState(appModeSetting);

  // update appMode value when setting changes
  useEffect(() => setAppModeLocalSetting(appModeSetting), [appModeSetting]);

  return (
    <Stack>
      <FormControl>
        <CustomSelect
          label={t('App Mode')}
          value={appModeLocalSetting[AppModeSettingsKeys.Mode]}
          onChange={(newAppMode) =>
            saveSettings(APP_MODE_SETTINGS_NAME, {
              ...appModeLocalSetting,
              [AppModeSettingsKeys.Mode]: newAppMode,
            })
          }
          renderValue={(value) => value as ReactNode}
          values={[
            {
              value: AppMode.Execute,
              label: (
                <AppModeDescription
                  title={AppMode.Execute}
                  description={t('APP_MODE_EXECUTE_DESCRIPTION')}
                  dataCy={APP_MODE_EXECUTE_BUTTON_CY}
                />
              ),
            },
            {
              value: AppMode.Review,
              label: (
                <AppModeDescription
                  title={AppMode.Review}
                  description={t('APP_MODE_REVIEW_DESCRIPTION')}
                  dataCy={APP_MODE_REVIEW_BUTTON_CY}
                />
              ),
            },
            {
              value: AppMode.Explain,
              label: (
                <AppModeDescription
                  title={AppMode.Explain}
                  description={t('APP_MODE_EXPLAIN_DESCRIPTION')}
                  dataCy={APP_MODE_EXPLAIN_BUTTON_CY}
                />
              ),
            },
            {
              value: AppMode.Collaborate,
              disabled: true,
              label: (
                <AppModeDescription
                  title={AppMode.Collaborate}
                  description={t('APP_MODE_COLLABORATE_DESCRIPTION')}
                  dataCy={APP_MODE_COLLABORATE_BUTTON_CY}
                />
              ),
            },
          ]}
          dataCy={SETTING_APP_MODE_SELECT_NAME_CY}
        />
      </FormControl>
      <Divider sx={{ m: 2 }} />
      {appModeLocalSetting[AppModeSettingsKeys.Mode] === AppMode.Execute && (
        <CodeExecutionSettings />
      )}
      {appModeLocalSetting[AppModeSettingsKeys.Mode] === AppMode.Review && (
        <CodeReviewSettings />
      )}
      {appModeLocalSetting[AppModeSettingsKeys.Mode] === AppMode.Explain && (
        <CodeExplainSettings />
      )}
    </Stack>
  );
};

export default SettingsView;
