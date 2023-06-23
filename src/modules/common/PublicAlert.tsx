import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';

import { useLocalContext } from '@graasp/apps-query-client';

const PublicAlert = (): JSX.Element | null => {
  const { t } = useTranslation();

  const context = useLocalContext();

  // does not show banner if user exists
  if (context?.memberId) {
    return null;
  }

  return <Alert severity="error">{t('PUBLIC_ALERT')}</Alert>;
};

export default PublicAlert;
