import React, { FC } from 'react';
import { PLAYER_VIEW_CYPRESS } from '../../../config/selectors';
import { useSettings } from '../../context/SettingsContext';
import { SETTINGS } from '../../../interfaces/settings';
import CodeReview from '../../common/CodeReview';
import { ReviewProvider } from '../../context/ReviewContext';
import { AppDataProvider } from '../../context/AppDataContext';

const PlayerView: FC = () => {
  const { settings } = useSettings();
  const code = settings[SETTINGS.CODE];
  const programmingLanguage = settings[SETTINGS.PROGRAMMING_LANGUAGE];
  return (
    <div data-cy={PLAYER_VIEW_CYPRESS}>
      This is the player view
      <ReviewProvider>
        <AppDataProvider>
          <CodeReview code={code} language={programmingLanguage} />
        </AppDataProvider>
      </ReviewProvider>
    </div>
  );
};

export default PlayerView;
