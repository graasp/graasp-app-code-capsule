import { FC } from 'react';

import PublicAlert from '@/modules/common/PublicAlert';

import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';
import AppModeWrapper from '../../common/AppModeWrapper';
import { CodeVersionProvider } from '../../context/CodeVersionContext';
import { SettingsProvider } from '../../context/SettingsContext';

const PlayerView: FC = () => (
  <div data-cy={PLAYER_VIEW_CYPRESS}>
    <PublicAlert />
    <CodeVersionProvider>
      <SettingsProvider>
        <AppModeWrapper />
      </SettingsProvider>
    </CodeVersionProvider>
  </div>
);

export default PlayerView;
