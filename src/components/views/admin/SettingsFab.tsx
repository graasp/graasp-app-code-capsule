import { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Loader } from '@graasp/ui';
import { Settings as SettingsIcon } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import {
  Box,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  AppSetting,
  CreateAppSetting,
  PatchAppSetting,
} from '@graasp/apps-query-client/dist/src/types';
import CustomDialog from '../../common/CustomDialog';
import {
  PROGRAMMING_LANGUAGE_SELECT_CYPRESS,
  PROGRAMMING_LANGUAGE_SELECT_ID,
  SETTINGS_DIALOG_CANCEL_BUTTON_CYPRESS,
  SETTINGS_DIALOG_SAVE_BUTTON_CYPRESS,
  SETTINGS_DIALOG_WINDOW_CYPRESS,
  SETTINGS_FAB_CYPRESS,
} from '../../../config/selectors';
import {
  DEFAULT_GENERAL_SETTINGS,
  GeneralSettings,
} from '../../../interfaces/settings';
import { GENERAL_SETTINGS_KEY } from '../../../config/appSettings';
import { useAppSettings } from '../../context/hooks';
import {
  CLOSE_SETTINGS_TIMEOUT,
  JAVA,
  JAVASCRIPT,
  MATLAB,
  PYTHON,
} from '../../../config/constants';
import { MUTATION_KEYS, useMutation } from '../../../config/queryClient';

enum TABS {
  CODE_SETTINGS = 'code_settings',
  DISPLAY_SETTINGS = 'display_settings',
}

const SettingsFab: FC = () => {
  const { t } = useTranslation();
  const [openSettings, setOpenSettings] = useState(false);
  const [tab, setTab] = useState(TABS.CODE_SETTINGS);
  const { data: appSettings, isLoading: isLoadingAppSettings } =
    useAppSettings();
  const generalAppSettings = (appSettings as AppSetting[])?.find(
    (setting) => setting.name === GENERAL_SETTINGS_KEY,
  );
  const generalSettings = generalAppSettings?.data as GeneralSettings;
  const [settings, setSettings] = useState({
    ...DEFAULT_GENERAL_SETTINGS,
    ...generalSettings,
  });
  const postSettings = useMutation<unknown, unknown, CreateAppSetting>(
    MUTATION_KEYS.POST_APP_SETTING,
  );
  const patchSettings = useMutation<unknown, unknown, PatchAppSetting>(
    MUTATION_KEYS.PATCH_APP_SETTING,
  );

  const handleChangeSelect =
    (key: string) =>
    ({ target: { value } }: { target: { value: string } }) => {
      setSettings({ ...settings, [key]: value });
    };

  const handleChangeEditor = (key: string) => (value?: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const renderSettings = (): ReactElement => {
    if (isLoadingAppSettings) {
      return <Loader />;
    }

    const programmingLanguageSelectControl = (
      <>
        <InputLabel id={PROGRAMMING_LANGUAGE_SELECT_ID}>
          {t('Programming Language')}
        </InputLabel>
        <Select
          data-cy={PROGRAMMING_LANGUAGE_SELECT_CYPRESS}
          label={t('Programming Language')}
          value={settings.programmingLanguage}
          onChange={handleChangeSelect('programmingLanguage')}
          inputProps={{
            name: 'programmingLanguage',
            id: PROGRAMMING_LANGUAGE_SELECT_ID,
          }}
        >
          <MenuItem value={JAVASCRIPT}>JavaScript</MenuItem>
          <MenuItem value={JAVA}>Java</MenuItem>
          <MenuItem value={PYTHON}>Python</MenuItem>
          <MenuItem value={MATLAB}>MATLAB</MenuItem>
        </Select>
      </>
    );
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
          <Stack direction="column" spacing={2} sx={{ height: '50vh' }}>
            <FormControl>{programmingLanguageSelectControl}</FormControl>
            <Editor
              defaultLanguage={settings.programmingLanguage}
              language={settings.programmingLanguage}
              value={settings.code}
              onChange={handleChangeEditor('code')}
              options={{
                scrollBeyondLastLine: false,
                detectIndentation: false,
                // todo: add this
                // tabSize:
                //   programmingLanguageSettings[settings.programmingLanguage].tabSize,
              }}
            />
          </Stack>
        </TabPanel>
        <TabPanel value={TABS.DISPLAY_SETTINGS}>
          <Stack sx={{ height: '50vh' }}>
            <div>Display settings</div>
          </Stack>
        </TabPanel>
      </TabContext>
    );
  };

  const handleClose = (save: boolean): void => {
    if (save) {
      // post settings
      if (!generalAppSettings) {
        postSettings.mutate({
          data: settings,
          name: GENERAL_SETTINGS_KEY,
        });
      } else {
        patchSettings.mutate({
          id: generalAppSettings.id,
          data: settings,
        });
      }
    } else {
      // restore old settings after some short delay to not glitch the display
      setTimeout(
        () =>
          setSettings({
            ...DEFAULT_GENERAL_SETTINGS,
            ...generalSettings,
          }),
        CLOSE_SETTINGS_TIMEOUT,
      );
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
      >
        {t('Save')}
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
