import React, { FC } from 'react';

import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';
import AppModeWrapper from '../../common/AppModeWrapper';
import { CodeVersionProvider } from '../../context/CodeVersionContext';
import { SettingsProvider } from '../../context/SettingsContext';

const PlayerView: FC = () => (
  <div data-cy={PLAYER_VIEW_CYPRESS}>
    <CodeVersionProvider>
      <SettingsProvider>
        <AppModeWrapper />
      </SettingsProvider>
    </CodeVersionProvider>
  </div>
);

export default PlayerView;
