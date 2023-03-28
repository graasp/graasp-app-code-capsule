import { useTranslation } from 'react-i18next';

import { Warning } from '@mui/icons-material';
import { Alert, Tooltip, useMediaQuery, useTheme } from '@mui/material';

const MiniAlert = (): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();

  const bigScreen = useMediaQuery(theme.breakpoints.up('sm'));
  const text = t('Unsaved content');
  if (!bigScreen) {
    return (
      <Tooltip title={text}>
        <Warning color="warning" />
      </Tooltip>
    );
  }

  return (
    <Alert
      sx={{
        height: 36.5,
        alignItems: 'center',
        py: 0,
      }}
      severity="warning"
      variant="filled"
    >
      {text}
    </Alert>
  );
};
export default MiniAlert;
