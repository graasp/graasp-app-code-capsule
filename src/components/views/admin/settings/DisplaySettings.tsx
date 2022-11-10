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
  GeneralSettingsKeys,
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
        settingKey={GeneralSettingsKeys.ShowHeader}
        value={localSettings[GeneralSettingsKeys.ShowHeader]}
        label={t('Show Header to Students')}
        dataCy={SHOW_HEADER_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={GeneralSettingsKeys.ShowToolbar}
        value={localSettings[GeneralSettingsKeys.ShowToolbar]}
        label={t('Show Toolbar to Students')}
        dataCy={SHOW_TOOLBAR_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={GeneralSettingsKeys.ShowVersionNavigation}
        value={localSettings[GeneralSettingsKeys.ShowVersionNavigation]}
        label={t('Show Version Navigation')}
        dataCy={SHOW_VERSION_NAVIGATION_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={GeneralSettingsKeys.ShowEditButton}
        value={localSettings[GeneralSettingsKeys.ShowEditButton]}
        label={t('Show Code Edit Button')}
        dataCy={SHOW_EDIT_BUTTON_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={GeneralSettingsKeys.ShowVisibilityButton}
        value={localSettings[GeneralSettingsKeys.ShowVisibilityButton]}
        label={t('Show Visibility Toggle')}
        dataCy={SHOW_VISIBILITY_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />

      <Divider sx={{ mt: 1 }} />
      <Typography variant="subtitle2">
        {t('Define Interaction Mode')}
      </Typography>

      <SettingsSwitch
        settingKey={GeneralSettingsKeys.AllowComments}
        value={localSettings[GeneralSettingsKeys.AllowComments]}
        label={t('Allow Comments')}
        dataCy={ALLOW_COMMENTS_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSwitch
        settingKey={GeneralSettingsKeys.AllowReplies}
        value={localSettings[GeneralSettingsKeys.AllowReplies]}
        label={t('Allow Replies')}
        dataCy={ALLOW_REPLIES_SWITCH_CYPRESS}
        changeSetting={changeSetting}
      />
      <SettingsSelect
        dataCy={REVIEW_MODES_SELECT_CYPRESS}
        settingsKey={GeneralSettingsKeys.ReviewMode}
        value={localSettings[GeneralSettingsKeys.ReviewMode]}
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
