import isEqual from 'lodash.isequal';

import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Visibility } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import {
  APP_MODE_SETTINGS_NAME,
  AppMode,
  CODE_EXECUTION_SETTINGS_NAME,
  DIFF_VIEW_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../../../../config/appSettingsTypes';
import {
  APP_MODE_COLLABORATE_BUTTON_CY,
  APP_MODE_EXECUTE_BUTTON_CY,
  APP_MODE_EXPLAIN_BUTTON_CY,
  APP_MODE_REVIEW_BUTTON_CY,
  EXECUTION_MODE_SETTINGS_KEY,
  EXPLAIN_MODE_SETTINGS_KEY,
  REVIEW_MODE_SETTINGS_KEY,
  SETTING_APP_MODE_SELECT_FORM_LABEL_CY,
  SETTING_APP_MODE_SELECT_NAME_CY,
  SETTING_DIFF_VIEW_NEW_CODE_CY,
  SETTING_DIFF_VIEW_OLD_CODE_CY,
  SETTING_FOOTER_CODE_EDITOR_CY,
  SETTING_HEADER_CODE_EDITOR_CY,
  SETTING_MAIN_CODE_EDITOR_CY,
} from '../../../../config/selectors';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_CODE_EXECUTION_SETTINGS,
  DEFAULT_DIFF_VIEW_SETTINGS,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../../../../config/settings';
import {
  AppModeSettingsKeys,
  CodeExecutionSettingsKeys,
  DiffViewSettingsKeys,
  InstructorCodeSettingsKeys,
} from '../../../../interfaces/settings';
import SubmitButtons from '../../../common/settings/SubmitButtons';
import { useSettings } from '../../../context/SettingsContext';
import DiffView from '../../../diffView/DiffView';
import CodeEditor from '../../../repl/CodeEditor';
import DataFileUpload from './DataFileUpload';
import PreLoadedLibrariesInput from './PreLoadedLibrariesInput';

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const {
    [CODE_EXECUTION_SETTINGS_NAME]:
      codeExecSettings = DEFAULT_CODE_EXECUTION_SETTINGS,
    [APP_MODE_SETTINGS_NAME]: appModeSetting = DEFAULT_APP_MODE_SETTINGS,
    [INSTRUCTOR_CODE_VERSION_SETTINGS_NAME]:
      instructorCodeVersionSetting = DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
    [DIFF_VIEW_SETTINGS_NAME]: diffViewSetting = DEFAULT_DIFF_VIEW_SETTINGS,
    saveSettings,
  } = useSettings();

  const [localCodeExecSettings, setLocalCodeExecSettings] =
    useState(codeExecSettings);
  const [
    instructorCodeVersionLocalSetting,
    setInstructorCodeVersionLocalSetting,
  ] = useState(instructorCodeVersionSetting);
  const [diffViewLocalSetting, setDiffViewLocalSetting] =
    useState(diffViewSetting);
  const [appModeLocalSetting, setAppModeLocalSetting] =
    useState(appModeSetting);

  // modal variables
  const [openDiffPreview, setOpenDiffPreview] = useState(false);

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

  // update diffViewLocalSetting value when setting changes
  useEffect(() => setDiffViewLocalSetting(diffViewSetting), [diffViewSetting]);

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
  const unsavedDiffViewChanges = !isEqual(
    diffViewLocalSetting,
    diffViewSetting,
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
            data-cy={APP_MODE_EXPLAIN_BUTTON_CY}
            value={AppMode.Explain}
            control={<Radio />}
            label={AppMode.Explain}
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
            <FormLabel>{t('Pre-loaded libraries')}</FormLabel>
            <PreLoadedLibrariesInput
              value={
                localCodeExecSettings[
                  CodeExecutionSettingsKeys.PreLoadedLibraries
                ]
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
      )}
      {appModeLocalSetting[AppModeSettingsKeys.Mode] === AppMode.Review && (
        <Stack spacing={1}>
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
      {appModeLocalSetting[AppModeSettingsKeys.Mode] === AppMode.Explain && (
        <Stack spacing={1}>
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
            <Stack flex={1}>
              <FormLabel>{t('Old Code')}</FormLabel>
              <CodeEditor
                id={SETTING_DIFF_VIEW_OLD_CODE_CY}
                value={diffViewLocalSetting[DiffViewSettingsKeys.OldCode]}
                setValue={(newValue) =>
                  setDiffViewLocalSetting((prevSetting) => ({
                    ...prevSetting,
                    [DiffViewSettingsKeys.OldCode]: newValue,
                  }))
                }
              />
            </Stack>
            <Stack flex={1}>
              <FormLabel>{t('New Code')}</FormLabel>
              <CodeEditor
                id={SETTING_DIFF_VIEW_NEW_CODE_CY}
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
