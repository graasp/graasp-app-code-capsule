import { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@graasp/ui';
import { Settings as SettingsIcon } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import { Box, Divider, Fab, Stack, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { styled } from '@mui/styles';
import CustomDialog from '../../common/CustomDialog';
import {
  ALLOW_COMMENTS_SWITCH_CYPRESS,
  ALLOW_REPLIES_SWITCH_CYPRESS,
  PROGRAMMING_LANGUAGE_SELECT_CYPRESS,
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
import { SETTINGS } from '../../../interfaces/settings';
import { CLOSE_SETTINGS_TIMEOUT } from '../../../config/constants';
import {
  programmingLanguageSelect,
  programmingLanguageSettings,
} from '../../../config/programmingLanguages';
import SettingsSwitch from '../../common/settings/SettingsSwitch';
import Loader from '../../common/Loader';
import SettingsSelect from '../../common/settings/SettingsSelect';
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
  const {
    saveSettings,
    resetSettings,
    unsavedChanges,
    changeSetting,
    settings,
  } = useSettings();

  const renderSettings = (): ReactElement => {
    const programmingLanguage = settings[SETTINGS.PROGRAMMING_LANGUAGE];
    return (
      <TabContext value={tab}>
        <TabList
          textColor="secondary"
          indicatorColor="secondary"
          onChange={(_, newTab) => setTab(newTab)}
          centered
        >
          <Tab value={TABS.CODE_SETTINGS} label={t('Code Settings')} />
          <Tab value={TABS.DISPLAY_SETTINGS} label={t('Display Settings')} />
        </TabList>
        <TabPanel value={TABS.CODE_SETTINGS}>
          <Stack direction="column" sx={{ height: '50vh' }}>
            <SettingsSelect
              settingsKey={SETTINGS.PROGRAMMING_LANGUAGE}
              values={programmingLanguageSelect}
              label={t('Programming Language')}
              dataCy={PROGRAMMING_LANGUAGE_SELECT_CYPRESS}
            />

            <Typography variant="subtitle2">{t('Code')}</Typography>
            <StyledEditor
              defaultLanguage={programmingLanguage}
              language={programmingLanguage}
              value={settings[SETTINGS.CODE]}
              onChange={(value) => changeSetting(SETTINGS.CODE, value)}
              options={{
                scrollBeyondLastLine: false,
                detectIndentation: false,
                tabSize:
                  programmingLanguageSettings[programmingLanguage].tabSize,
              }}
              loading={<Loader />}
            />
          </Stack>
        </TabPanel>
        <TabPanel value={TABS.DISPLAY_SETTINGS}>
          <Stack sx={{ height: '50vh' }}>
            <Typography variant="subtitle2">
              {t('App Customization')}
            </Typography>
            <SettingsSwitch
              settingKey={SETTINGS.SHOW_HEADER}
              label={t('Show Header to Students')}
              dataCy={SHOW_HEADER_SWITCH_CYPRESS}
            />
            <SettingsSwitch
              settingKey={SETTINGS.SHOW_TOOLBAR}
              label={t('Show Toolbar to Students')}
              dataCy={SHOW_TOOLBAR_SWITCH_CYPRESS}
            />
            <SettingsSwitch
              settingKey={SETTINGS.SHOW_VERSION_NAVIGATION}
              label={t('Show Version Navigation')}
              dataCy={SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS}
            />
            <SettingsSwitch
              settingKey={SETTINGS.SHOW_EDIT_BUTTON}
              label={t('Show Code Edit Button')}
              dataCy={SHOW_EDIT_BUTTON_SWITCH_CYPRESS}
            />
            <SettingsSwitch
              settingKey={SETTINGS.SHOW_VISIBILITY_BUTTON}
              label={t('Show Visibility Toggle')}
              dataCy={SHOW_VISIBILITY_SWITCH_CYPRESS}
            />

            <Divider sx={{ mt: 1 }} />
            <Typography variant="subtitle2">
              {t('Define Interaction Mode')}
            </Typography>

            <SettingsSwitch
              settingKey={SETTINGS.ALLOW_COMMENTS}
              label={t('Allow Comments')}
              dataCy={ALLOW_COMMENTS_SWITCH_CYPRESS}
            />
            <SettingsSwitch
              settingKey={SETTINGS.ALLOW_REPLIES}
              label={t('Allow Replies')}
              dataCy={ALLOW_REPLIES_SWITCH_CYPRESS}
            />
          </Stack>
        </TabPanel>
      </TabContext>
    );
  };

  const handleClose = (save: boolean): void => {
    if (save) {
      saveSettings();
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
