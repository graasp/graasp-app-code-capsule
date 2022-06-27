import React, { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@graasp/ui';

import { Code, DisplaySettings } from '@mui/icons-material';
import { Box, Divider, Fab, Stack, Tooltip, Typography } from '@mui/material';

import {
  CLOSE_SETTINGS_TIMEOUT,
  INSTRUCTOR_CODE_ID,
  REVIEW_MODES,
} from '../../../config/constants';
import {
  ALLOW_COMMENTS_SWITCH_CYPRESS,
  ALLOW_REPLIES_SWITCH_CYPRESS,
  CODE_SETTINGS_FAB_CYPRESS,
  DISPLAY_SETTINGS_FAB_CYPRESS,
  REVIEW_MODES_SELECT_CYPRESS,
  SETTINGS_CODE_DIALOG_WINDOW_CYPRESS,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS,
  SHOW_EDIT_BUTTON_SWITCH_CYPRESS,
  SHOW_HEADER_SWITCH_CYPRESS,
  SHOW_TOOLBAR_SWITCH_CYPRESS,
  SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS,
  SHOW_VISIBILITY_SWITCH_CYPRESS,
} from '../../../config/selectors';
import { SETTINGS_KEYS } from '../../../interfaces/settings';
import CodeEditor from '../../common/CodeEditor';
import CustomDialog from '../../common/CustomDialog';
import SettingsSelect from '../../common/settings/SettingsSelect';
import SettingsSwitch from '../../common/settings/SettingsSwitch';
import { useCodeEditingContext } from '../../context/CodeEditingContext';
import { useCodeVersionContext } from '../../context/CodeVersionContext';
import { useSettings } from '../../context/SettingsContext';

const SettingsFab: FC = () => {
  const { t } = useTranslation();
  const [openDisplaySettings, setOpenDisplaySettings] = useState(false);
  const [openCodeSettings, setOpenCodeSettings] = useState(false);
  const { saveSettings, resetSettings, unsavedChanges } = useSettings();
  const { submit: saveCodeVersionSetting } = useCodeEditingContext();
  const { setCodeId } = useCodeVersionContext();

  const renderSettings = (): ReactElement => (
    <Stack>
      <Typography variant="subtitle2">{t('App Customization')}</Typography>
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_HEADER}
        label={t('Show Header to Students')}
        dataCy={SHOW_HEADER_SWITCH_CYPRESS}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_TOOLBAR}
        label={t('Show Toolbar to Students')}
        dataCy={SHOW_TOOLBAR_SWITCH_CYPRESS}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_VERSION_NAVIGATION}
        label={t('Show Version Navigation')}
        dataCy={SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_EDIT_BUTTON}
        label={t('Show Code Edit Button')}
        dataCy={SHOW_EDIT_BUTTON_SWITCH_CYPRESS}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON}
        label={t('Show Visibility Toggle')}
        dataCy={SHOW_VISIBILITY_SWITCH_CYPRESS}
      />

      <Divider sx={{ mt: 1 }} />
      <Typography variant="subtitle2">
        {t('Define Interaction Mode')}
      </Typography>

      <SettingsSwitch
        settingKey={SETTINGS_KEYS.ALLOW_COMMENTS}
        label={t('Allow Comments')}
        dataCy={ALLOW_COMMENTS_SWITCH_CYPRESS}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.ALLOW_REPLIES}
        label={t('Allow Replies')}
        dataCy={ALLOW_REPLIES_SWITCH_CYPRESS}
      />

      <SettingsSelect
        dataCy={REVIEW_MODES_SELECT_CYPRESS}
        settingsKey={SETTINGS_KEYS.REVIEW_MODE}
        label={t('Define Review Mode')}
        values={REVIEW_MODES.map(({ label, value }) => ({
          // @ts-ignore
          label: t(label),
          value,
        }))}
      />
    </Stack>
  );

  const handleClose = (save: boolean): void => {
    if (save) {
      saveSettings();
      saveCodeVersionSetting();
      setCodeId(INSTRUCTOR_CODE_ID);
    } else {
      // restore old settings after some short delay to not glitch the display
      setTimeout(() => resetSettings(), CLOSE_SETTINGS_TIMEOUT);
    }
    // close the dialog
    setOpenDisplaySettings(false);
  };
  const renderActions = (): ReactElement => (
    <Box>
      <Button
        sx={{ m: 1 }}
        dataCy={SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS}
        onClick={() => handleClose(false)}
        color="error"
        variant="outlined"
      >
        {t('Cancel')}
      </Button>
      <Button
        sx={{ m: 1 }}
        dataCy={SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS}
        onClick={() => handleClose(true)}
        disabled={!unsavedChanges}
        variant="outlined"
      >
        {unsavedChanges ? t('Save') : t('Saved')}
      </Button>
    </Box>
  );

  return (
    <>
      <CustomDialog
        dataCy={SETTINGS_DISPLAY_DIALOG_WINDOW_CYPRESS}
        open={openDisplaySettings}
        title={
          <Stack direction="row" spacing={2} alignItems="center">
            <DisplaySettings sx={{ pr: 2 }} />
            {t('Display Settings')}
          </Stack>
        }
        content={renderSettings()}
        actions={renderActions()}
      />
      <CustomDialog
        dataCy={SETTINGS_CODE_DIALOG_WINDOW_CYPRESS}
        open={openCodeSettings}
        title={
          <Stack direction="row" spacing={2} alignItems="center">
            <Code sx={{ pr: 2 }} />
            {t('Code Settings')}
          </Stack>
        }
        content={
          <CodeEditor
            submitTarget="settings"
            onClose={() => setOpenCodeSettings(false)}
          />
        }
      />
      <Stack
        spacing={1}
        sx={{ position: 'fixed !important', right: '1rem', bottom: '1rem' }}
      >
        <Tooltip title={t('Code Settings')} placement="left">
          <Fab
            color="primary"
            onClick={() => {
              setOpenCodeSettings(true);
            }}
            data-cy={CODE_SETTINGS_FAB_CYPRESS}
          >
            <Code />
          </Fab>
        </Tooltip>
        <Tooltip title={t('Display Settings')} placement="left">
          <Fab
            color="primary"
            data-cy={DISPLAY_SETTINGS_FAB_CYPRESS}
            onClick={() => {
              setOpenDisplaySettings(true);
            }}
          >
            <DisplaySettings />
          </Fab>
        </Tooltip>
      </Stack>
    </>
  );
};

export default SettingsFab;
