import { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@graasp/ui';

import {
  Code,
  DisplaySettings,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Divider,
  Fab,
  Stack,
  Tab,
  Typography,
  styled,
} from '@mui/material';

import Editor from '@monaco-editor/react';

import {
  CLOSE_SETTINGS_TIMEOUT,
  INSTRUCTOR_CODE_ID,
  REVIEW_MODES,
} from '../../../config/constants';
import {
  ALLOW_COMMENTS_SWITCH_CYPRESS,
  ALLOW_REPLIES_SWITCH_CYPRESS,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DIALOG_WINDOW_CYPRESS,
  SETTINGS_FAB_CYPRESS,
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

const StyledEditor = styled(Editor)({
  padding: '8px',
  border: 'solid silver 1px',
  borderRadius: '4px',
});

enum TABS {
  CODE_SETTINGS = 'code_settings',
  DISPLAY_SETTINGS = 'display_settings',
}

const SettingsFab: FC = () => {
  const { t } = useTranslation();
  const [openSettings, setOpenSettings] = useState(false);
  const [tab, setTab] = useState(TABS.CODE_SETTINGS);
  const { saveSettings, resetSettings, unsavedChanges } = useSettings();
  const { submit: saveCodeVersionSetting } = useCodeEditingContext();
  const { setCodeId } = useCodeVersionContext();

  const renderSettings = (): ReactElement => (
    <TabContext value={tab}>
      <TabList
        textColor="secondary"
        indicatorColor="secondary"
        onChange={(_, newTab) => setTab(newTab)}
        centered
      >
        <Tab
          value={TABS.CODE_SETTINGS}
          label={t('Code Settings')}
          icon={<Code />}
          iconPosition="start"
        />
        <Tab
          value={TABS.DISPLAY_SETTINGS}
          label={t('Display Settings')}
          icon={<DisplaySettings />}
          iconPosition="start"
        />
      </TabList>
      <TabPanel value={TABS.CODE_SETTINGS}>
        <CodeEditor showButtonBar={false} />
      </TabPanel>
      <TabPanel value={TABS.DISPLAY_SETTINGS}>
        <Stack sx={{ height: '50vh' }}>
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
            settingsKey={SETTINGS_KEYS.REVIEW_MODE}
            label={t('Define Review Mode')}
            values={REVIEW_MODES.map(({ label, value }) => ({
              // @ts-ignore
              label: t(label),
              value,
            }))}
          />
        </Stack>
      </TabPanel>
    </TabContext>
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
    setOpenSettings(false);
  };
  const renderActions = (): ReactElement => (
    <Box>
      <Button
        sx={{ m: 1 }}
        dataCy={SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS}
        onClick={() => handleClose(false)}
        color="error"
      >
        {t('Cancel')}
      </Button>
      <Button
        sx={{ m: 1 }}
        dataCy={SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS}
        onClick={() => handleClose(true)}
        disabled={!unsavedChanges}
      >
        {unsavedChanges ? t('Save') : t('Saved')}
      </Button>
    </Box>
  );

  return (
    <>
      <CustomDialog
        dataCy={SETTINGS_DIALOG_WINDOW_CYPRESS}
        open={openSettings}
        title={t('Settings')}
        content={renderSettings()}
        actions={renderActions()}
      />
      <Fab
        color="primary"
        data-cy={SETTINGS_FAB_CYPRESS}
        onClick={() => setOpenSettings(true)}
        sx={{
          position: 'fixed !important',
          bottom: '1rem',
          right: '1rem',
        }}
      >
        <SettingsIcon />
      </Fab>
    </>
  );
};

export default SettingsFab;
