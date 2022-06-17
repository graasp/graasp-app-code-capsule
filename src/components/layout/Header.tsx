import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Header as GraaspHeader, GraaspLogo } from '@graasp/ui';

import { Stack, Typography, styled } from '@mui/material';

import { GRAASP_LOGO_HEADER_HEIGHT } from '../../config/constants';
import { GRAASP_LOGO_CYPRESS } from '../../config/selectors';

const StyledGraaspLogo = styled(GraaspLogo)({
  fill: '#fff',
});

// type Props = {};

const Header: FC = () => {
  const { t } = useTranslation();

  return (
    <header>
      <GraaspHeader
        hasSidebar={false}
        leftContent={
          <Stack direction="row" justifyContent="center" alignContent="center">
            <StyledGraaspLogo
              data-cy={GRAASP_LOGO_CYPRESS}
              height={GRAASP_LOGO_HEADER_HEIGHT}
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
