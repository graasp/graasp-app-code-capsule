import { FC, ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import isEqual from 'lodash.isequal';

import {
  APP_MODE_SETTINGS_NAME,
  AppMode,
  DIFF_VIEW_SETTINGS_NAME,
} from '@/config/appSettingsTypes';
import {
  ProgrammingLanguagesType,
  programmingLanguageSelect,
} from '@/config/programmingLanguages';
import {
  APP_MODE_COLLABORATE_BUTTON_CY,
  APP_MODE_EXECUTE_BUTTON_CY,
  APP_MODE_EXPLAIN_BUTTON_CY,
  APP_MODE_REVIEW_BUTTON_CY,
  DIFF_VIEW_LANGUAGE_SELECT_CYPRESS,
  EXPLAIN_MODE_SETTINGS_KEY,
  SETTING_APP_MODE_SELECT_NAME_CY,
  SETTING_DIFF_VIEW_NEW_CODE_CY,
  SETTING_DIFF_VIEW_OLD_CODE_CY,
} from '@/config/selectors';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_DIFF_VIEW_SETTINGS,
} from '@/config/settings';
import {
  AppModeSettingsKeys,
  DiffViewSettingsKeys,
} from '@/interfaces/settings';
import AppModeDescription from '@/modules/common/AppModeDescription';
import CustomSelect from '@/modules/layout/CustomSelect';

import SubmitButtons from '../../../common/settings/SubmitButtons';
import { useSettings } from '../../../context/SettingsContext';
import DiffView from '../../../diffView/DiffView';
import CodeEditor from '../../../repl/CodeEditor';
import CodeExecutionSettings from './CodeExecutionSettings';
import CodeReviewSettings from './CodeReviewSettings';

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const {
    [APP_MODE_SETTINGS_NAME]: appModeSetting = DEFAULT_APP_MODE_SETTINGS,
    [DIFF_VIEW_SETTINGS_NAME]: diffViewSetting = DEFAULT_DIFF_VIEW_SETTINGS,
    saveSettings,
  } = useSettings();

  const [diffViewLocalSetting, setDiffViewLocalSetting] =
    useState(diffViewSetting);
  const [appModeLocalSetting, setAppModeLocalSetting] =
    useState(appModeSetting);

  // modal variables
  const [openDiffPreview, setOpenDiffPreview] = useState(false);

  // update diffViewLocalSetting value when setting changes
  useEffect(() => setDiffViewLocalSetting(diffViewSetting), [diffViewSetting]);

  // update appMode value when setting changes
  useEffect(() => setAppModeLocalSetting(appModeSetting), [appModeSetting]);

  const unsavedDiffViewChanges = !isEqual(
    diffViewLocalSetting,
    diffViewSetting,
  );

  return (
    <Stack>
      <FormControl>
        <CustomSelect
          label={t('App Mode')}
          value={appModeLocalSetting[AppModeSettingsKeys.Mode]}
          onChange={(newAppMode) =>
            saveSettings(
              APP_MODE_SETTINGS_NAME,
              appModeLocalSetting.set(
                AppModeSettingsKeys.Mode,
                newAppMode as AppMode,
              ),
            )
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
        <Stack spacing={1}>
          <CustomSelect
            dataCy={DIFF_VIEW_LANGUAGE_SELECT_CYPRESS}
            onChange={(newLanguage: ProgrammingLanguagesType) =>
              setDiffViewLocalSetting((prevSetting) => ({
                ...prevSetting,
                [DiffViewSettingsKeys.Language]: newLanguage,
              }))
            }
            value={diffViewLocalSetting[DiffViewSettingsKeys.Language]}
            label={t('Programming Language')}
            values={programmingLanguageSelect}
          />
          <FormLabel>{t('Line Offset')}</FormLabel>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="end"
          >
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              value={diffViewLocalSetting[DiffViewSettingsKeys.LinesOffset]}
              onChange={({ target }) =>
                setDiffViewLocalSetting((prevSetting) => ({
                  ...prevSetting,
                  [DiffViewSettingsKeys.LinesOffset]: parseInt(
                    target.value,
                    10,
                  ),
                }))
              }
            />
            <Box>
              <Tooltip
                title={
                  unsavedDiffViewChanges
                    ? t('Save Setting to Preview')
                    : t('Show Preview')
                }
              >
                <span>
                  <Button
                    startIcon={<Visibility />}
                    disabled={unsavedDiffViewChanges}
                    onClick={() => setOpenDiffPreview(true)}
                  >
                    {t('Preview')}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Stack flex={1} width="50%">
              <FormLabel>{t('Old Code')}</FormLabel>
              <CodeEditor
                id={SETTING_DIFF_VIEW_OLD_CODE_CY}
                languageSupport={[
                  diffViewLocalSetting[DiffViewSettingsKeys.Language],
                ]}
                value={diffViewLocalSetting[DiffViewSettingsKeys.OldCode]}
                setValue={(newValue) =>
                  setDiffViewLocalSetting((prevSetting) => ({
                    ...prevSetting,
                    [DiffViewSettingsKeys.OldCode]: newValue,
                  }))
                }
              />
            </Stack>
            <Stack flex={1} width="50%">
              <FormLabel>{t('New Code')}</FormLabel>
              <CodeEditor
                id={SETTING_DIFF_VIEW_NEW_CODE_CY}
                languageSupport={[
                  diffViewLocalSetting[DiffViewSettingsKeys.Language],
                ]}
                value={diffViewLocalSetting[DiffViewSettingsKeys.NewCode]}
                setValue={(newValue) =>
                  setDiffViewLocalSetting((prevSetting) => ({
                    ...prevSetting,
                    [DiffViewSettingsKeys.NewCode]: newValue,
                  }))
                }
              />
            </Stack>
          </Stack>
          <Dialog
            maxWidth="xl"
            fullWidth
            open={openDiffPreview}
            onClose={() => setOpenDiffPreview(false)}
          >
            <DialogContent>
              <DiffView />
            </DialogContent>
          </Dialog>

          <SubmitButtons
            onCancel={() => setDiffViewLocalSetting(diffViewSetting)}
            onSave={() =>
              saveSettings(DIFF_VIEW_SETTINGS_NAME, diffViewLocalSetting)
            }
            settingKey={EXPLAIN_MODE_SETTINGS_KEY}
            unsavedChanges={unsavedDiffViewChanges}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default SettingsView;
