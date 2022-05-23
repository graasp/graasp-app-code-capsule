import React, { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GraaspLogo, Header as GraaspHeader } from '@graasp/ui';
import { makeStyles } from '@material-ui/core';
import { GRAASP_LOGO_CYPRESS } from '../../config/selectors';
import { GRAASP_LOGO_HEADER_HEIGHT } from '../../config/constants';

const useStyles = makeStyles(() => ({
  logo: {
    fill: '#fff',
  },
}));

// type Props = {};

const Header: FC = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <header>
      <GraaspHeader
        hasSidebar={false}
        leftContent={
          <Stack direction="row" justifyContent="center" alignContent="center">
            <GraaspLogo
              data-cy={GRAASP_LOGO_CYPRESS}
              height={GRAASP_LOGO_HEADER_HEIGHT}
              className={classes.logo}
            />
            <Typography variant="h6">{t('Code Review')}</Typography>
          </Stack>
        }
        rightContent={<Typography>Hello</Typography>}
      />
    </header>
  );
};

export default Header;
