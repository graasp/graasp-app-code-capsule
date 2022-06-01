import React, { FC } from 'react';
import { Language } from 'prism-react-renderer';
import { useSettings } from '../../context/SettingsContext';
import { SETTINGS } from '../../../interfaces/settings';
import CodeReview from '../../common/CodeReview';
import { ReviewProvider } from '../../context/ReviewContext';
import { AppDataProvider } from '../../context/AppDataContext';

// todo: remove this once there are props
// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const PresetView: FC<Props> = () => {
  const { settings } = useSettings();
  const code = settings[SETTINGS.CODE];
  const language = settings[SETTINGS.PROGRAMMING_LANGUAGE] as Language;
  return (
    <ReviewProvider>
      <AppDataProvider>
        <CodeReview code={code} language={language} />
      </AppDataProvider>
    </ReviewProvider>
  );
};

export default PresetView;
