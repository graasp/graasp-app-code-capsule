import React, { FC } from 'react';
import { styled } from '@mui/material';
import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';
import { SettingsProvider } from '../../context/SettingsContext';
import CodeReviewWrapper from '../../common/CodeReviewWrapper';

const Div = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PlayerView: FC = () => (
  <Div data-cy={PLAYER_VIEW_CYPRESS}>
    <SettingsProvider>
      <CodeReviewWrapper />
    </SettingsProvider>
  </Div>
);

export default PlayerView;
