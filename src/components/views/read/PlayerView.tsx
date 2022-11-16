import React, { FC } from 'react';

import { styled } from '@mui/material';

import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';
import AppModeWrapper from '../../common/AppModeWrapper';
import { CodeVersionProvider } from '../../context/CodeVersionContext';
import { SettingsProvider } from '../../context/SettingsContext';

const Div = styled('div')({
  // height: '100vh',
});

const PlayerView: FC = () => (
  <Div data-cy={PLAYER_VIEW_CYPRESS}>
    <CodeVersionProvider>
      <SettingsProvider>
        <AppModeWrapper />
      </SettingsProvider>
    </CodeVersionProvider>
  </Div>
);

export default PlayerView;
