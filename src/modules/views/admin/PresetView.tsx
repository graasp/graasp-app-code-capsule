import { useTranslation } from 'react-i18next';

import { Alert, Stack } from '@mui/material';

import AppModeWrapper from '../../common/AppModeWrapper';

const PresetView = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Alert severity="info" sx={{ m: 2 }}>
        {t('Preset View Explanation')}
      </Alert>
      <AppModeWrapper />
    </Stack>
  );
};
export default PresetView;
