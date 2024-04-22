import { FC, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DisplaySettings as DisplaySettingsIcon } from '@mui/icons-material';
import { Fab, Stack, Tooltip } from '@mui/material';

import { Button } from '@graasp/ui';

import isEqual from 'lodash.isequal';

import { GENERAL_SETTINGS_NAME } from '../../../config/appSettingsTypes';
import {
  CLOSE_SETTINGS_TIMEOUT,
  INSTRUCTOR_CODE_ID,
} from '../../../config/constants';
import {
  DISPLAY_SETTINGS_FAB_CYPRESS,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS,
} from '../../../config/selectors';
import { DEFAULT_GENERAL_SETTINGS } from '../../../config/settings';
import { useCodeVersionContext } from '../../context/CodeVersionContext';
import { useSettings } from '../../context/SettingsContext';
import CustomDialog from '../../layout/CustomDialog';
import DisplaySettings from './settings/DisplaySettings';

const SettingsFab: FC = () => {
  const { t } = useTranslation();
  const {
    [GENERAL_SETTINGS_NAME]: settings = DEFAULT_GENERAL_SETTINGS,
    saveSettings,
  } = useSettings();
  const { setCodeId } = useCodeVersionContext();
  const [openDisplaySettings, setOpenDisplaySettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => setLocalSettings(settings), [settings]);

  // need to compare the raw JS objects
  const unsavedChanges = !isEqual(settings, localSettings);

  const resetSettings = (): void => setLocalSettings(settings);

  const changeSetting = (
    settingKey: string,
    newValue: string | boolean,
  ): void =>
    setLocalSettings((prevSetting) => ({
      ...prevSetting,
      [settingKey]: newValue,
    }));

  const handleClose = (save: boolean): void => {
    if (save) {
      saveSettings(GENERAL_SETTINGS_NAME, localSettings);
      setCodeId(INSTRUCTOR_CODE_ID);
    } else {
      // restore old settings after some short delay to not glitch the display
      setTimeout(() => resetSettings(), CLOSE_SETTINGS_TIMEOUT);
    }
    // close the dialog
    setOpenDisplaySettings(false);
  };

  const renderActions = (): ReactElement => (
    <Stack spacing={1} direction="row">
      <Button
        dataCy={SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS}
        onClick={() => handleClose(false)}
        color="error"
        variant="outlined"
      >
        {t('Cancel')}
      </Button>
      <Button
        dataCy={SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS}
        onClick={() => handleClose(true)}
        disabled={!unsavedChanges}
        variant="outlined"
      >
        {unsavedChanges ? t('Save') : t('Saved')}
      </Button>
    </Stack>
  );

  return (
    <>
      <CustomDialog
        dataCy={SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS}
        open={openDisplaySettings}
        title={
          <Stack direction="row" alignItems="center">
            <DisplaySettingsIcon sx={{ mr: 1 }} />
            {t('Display Settings')}
          </Stack>
        }
        content={
          <DisplaySettings
            localSettings={localSettings}
            changeSetting={changeSetting}
          />
        }
        actions={renderActions()}
      />
      <Stack
        spacing={1}
        sx={{ position: 'fixed !important', right: '1rem', bottom: '1rem' }}
      >
        <Tooltip title={t('Display Settings')} placement="left">
          <Fab
            color="primary"
            data-cy={DISPLAY_SETTINGS_FAB_CYPRESS}
            onClick={() => {
              setOpenDisplaySettings(true);
            }}
          >
            <DisplaySettingsIcon />
          </Fab>
        </Tooltip>
      </Stack>
    </>
  );
};

export default SettingsFab;
