import React, { FC } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { GraaspLogo } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import { GRAASP_LOGO_CYPRESS } from '../../config/selectors';

// type Props = {};

const Header: FC = () => {
  const { t } = useTranslation();

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <GraaspLogo data-cy={GRAASP_LOGO_CYPRESS} height={66} />
          <Typography>{t('Code Review')}</Typography>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
