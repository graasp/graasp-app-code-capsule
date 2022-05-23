import React, { FC } from 'react';
import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';

const PlayerView: FC = () => (
  <div data-cy={PLAYER_VIEW_CYPRESS}>
    This is the player view
    <table>
      <tbody />
    </table>
  </div>
);

export default PlayerView;
