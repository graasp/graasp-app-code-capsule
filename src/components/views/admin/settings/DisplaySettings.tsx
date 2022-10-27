import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider, Stack, Typography } from '@mui/material';

import { REVIEW_MODES } from '../../../../config/constants';
import {
  ALLOW_COMMENTS_SWITCH_CYPRESS,
  ALLOW_REPLIES_SWITCH_CYPRESS,
  REVIEW_MODES_SELECT_CYPRESS,
  SHOW_EDIT_BUTTON_SWITCH_CYPRESS,
  SHOW_HEADER_SWITCH_CYPRESS,
  SHOW_TOOLBAR_SWITCH_CYPRESS,
  SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS,
  SHOW_VISIBILITY_SWITCH_CYPRESS,
} from '../../../../config/selectors';
import {
  GeneralSettings,
  SETTINGS_KEYS,
} from '../../../../interfaces/settings';
import SettingsSelect from '../../../common/settings/SettingsSelect';
import SettingsSwitch from '../../../common/settings/SettingsSwitch';

type Props = {
  localSettings: GeneralSettings;
  changeSetting: (settingKey: string, newValue: string | boolean) => void;
};

const DisplaySettings: FC<Props> = ({ localSettings, changeSetting }) => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Typography variant="subtitle2">{t('App Customization')}</Typography>
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_HEADER}
        value={localSettings[SETTINGS_KEYS.SHOW_HEADER]}
        label={t('Show Header to Students')}
        dataCy={SHOW_HEADER_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_TOOLBAR}
        value={localSettings[SETTINGS_KEYS.SHOW_TOOLBAR]}
        label={t('Show Toolbar to Students')}
        dataCy={SHOW_TOOLBAR_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_VERSION_NAVIGATION}
        value={localSettings[SETTINGS_KEYS.SHOW_VERSION_NAVIGATION]}
        label={t('Show Version Navigation')}
        dataCy={SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_EDIT_BUTTON}
        value={localSettings[SETTINGS_KEYS.SHOW_EDIT_BUTTON]}
        label={t('Show Code Edit Button')}
        dataCy={SHOW_EDIT_BUTTON_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON}
        value={localSettings[SETTINGS_KEYS.SHOW_VISIBILITY_BUTTON]}
        label={t('Show Visibility Toggle')}
        dataCy={SHOW_VISIBILITY_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />

      <Divider sx={{ mt: 1 }} />
      <Typography variant="subtitle2">
        {t('Define Interaction Mode')}
      </Typography>

      <SettingsSwitch
        settingKey={SETTINGS_KEYS.ALLOW_COMMENTS}
        value={localSettings[SETTINGS_KEYS.ALLOW_COMMENTS]}
        label={t('Allow Comments')}
        dataCy={ALLOW_COMMENTS_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={SETTINGS_KEYS.ALLOW_REPLIES}
        value={localSettings[SETTINGS_KEYS.ALLOW_REPLIES]}
        label={t('Allow Replies')}
        dataCy={ALLOW_REPLIES_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSelect
        dataCy={REVIEW_MODES_SELECT_CYPRESS}
        settingsKey={SETTINGS_KEYS.REVIEW_MODE}
        value={localSettings[SETTINGS_KEYS.REVIEW_MODE]}
        label={t('Define Review Mode')}
        values={REVIEW_MODES.map(({ label, value }) => ({
          label: t(label),
          value,
        }))}
        changeSetting={changeSetting}
      />
    </Stack>
  );
};
export default DisplaySettings;
