import React, { FC } from 'react';
import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';
import { SettingsProvider } from '../../context/SettingsContext';
import CodeReviewWrapper from '../../common/CodeReviewWrapper';

const PlayerView: FC = () => (
  <div data-cy={PLAYER_VIEW_CYPRESS}>
    This is the player view
    <SettingsProvider>
      <CodeReviewWrapper />
    </SettingsProvider>
  </div>
);

export default PlayerView;
