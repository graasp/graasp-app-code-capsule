import { useTranslation } from 'react-i18next';

import { Alert, Stack } from '@mui/material';

import CodeReview from '../../codeReview/CodeReview';

const PresetView = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Alert severity="info" sx={{ m: 2 }}>
        {t('Preset View Explanation')}
      </Alert>
      <CodeReview isPreset />
    </Stack>
  );
};
export default PresetView;
