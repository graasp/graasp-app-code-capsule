import React, { FC } from 'react';
import { Language } from 'prism-react-renderer';
import { styled } from '@mui/material';
import { useSettings } from '../context/SettingsContext';
import { SETTINGS_KEYS } from '../../interfaces/settings';
import CodeReview from './CodeReview';
import { ReviewProvider } from '../context/ReviewContext';
import { AppDataProvider } from '../context/AppDataContext';
import CodeReviewToolbar from './CodeReviewToolbar';
import { CODE_REVIEW_CONTAINER_CYPRESS } from '../../config/selectors';
import { VisibilityProvider } from '../context/VisibilityContext';

const CodeContainer = styled('div')({
  margin: 'auto',
  fontSize: '1.1rem',
  padding: '16px',
  maxWidth: '600px',
  width: '80vw',
  border: 'solid var(--graasp-primary) 1px',
  borderRadius: '4px',
  wordWrap: 'break-word',
});

// todo: remove this once there are props
// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const CodeReviewWrapper: FC<Props> = () => {
  const { settings } = useSettings();

  const code = settings[SETTINGS_KEYS.CODE];
  const numberOfLines = code.split('\n').length;
  const language = settings[SETTINGS_KEYS.PROGRAMMING_LANGUAGE] as Language;

  return (
    <ReviewProvider>
      <VisibilityProvider numberOfLines={numberOfLines}>
        <AppDataProvider>
          <CodeContainer data-cy={CODE_REVIEW_CONTAINER_CYPRESS}>
            <CodeReviewToolbar />
            <CodeReview code={code} language={language} />
          </CodeContainer>
        </AppDataProvider>
      </VisibilityProvider>
    </ReviewProvider>
  );
};

export default CodeReviewWrapper;
