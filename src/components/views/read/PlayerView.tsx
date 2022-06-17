import React, { FC } from 'react';

import { styled } from '@mui/material';

import { CodeContexts } from '../../../config/codeVersions';
import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';
import CodeReviewWrapper from '../../common/CodeReviewWrapper';
import { CodeEditingProvider } from '../../context/CodeEditingContext';
import { CodeVersionProvider } from '../../context/CodeVersionContext';
import { SettingsProvider } from '../../context/SettingsContext';

const Div = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const PlayerView: FC = () => (
  <Div data-cy={PLAYER_VIEW_CYPRESS}>
    <CodeVersionProvider>
      <CodeEditingProvider context={CodeContexts.Student}>
        <SettingsProvider>
          <CodeReviewWrapper />
        </SettingsProvider>
      </CodeEditingProvider>
    </CodeVersionProvider>
  </Div>
);

export default PlayerView;
