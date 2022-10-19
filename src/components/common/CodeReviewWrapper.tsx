import React, { FC, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@graasp/ui';

import { styled } from '@mui/material';

import { AppView, SMALL_BORDER_RADIUS } from '../../config/layout';
import {
  CODE_EDITOR_CONTAINER_CYPRESS,
  CODE_EXECUTION_CONTAINER_CYPRESS,
  CODE_REVIEW_CONTAINER_CYPRESS,
} from '../../config/selectors';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import { ReviewProvider } from '../context/ReviewContext';
import { VisibilityProvider } from '../context/VisibilityContext';
import Repl from '../repl/Repl';
import CodeEditor from './CodeEditor';
import CodeReview from './CodeReview';
import CodeReviewToolbar from './CodeReviewToolbar';

const Container = styled('div')(({ theme }) => ({
  margin: 'auto',
  fontSize: '1rem',
  padding: theme.spacing(2),
  maxWidth: '600px',
  width: '80vw',
  borderRadius: SMALL_BORDER_RADIUS,
  wordWrap: 'break-word',
}));

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const CodeReviewWrapper: FC<Props> = () => {
  const { t } = useTranslation();
  const [view, setView] = useState<AppView>(AppView.CodeReview);
  const { codeVersion } = useCodeVersionContext();

  const getContent = (): ReactElement => {
    switch (view) {
      case AppView.CodeEditor:
        return (
          <Container data-cy={CODE_EDITOR_CONTAINER_CYPRESS}>
            <CodeEditor
              onClose={() => setView(AppView.CodeReview)}
              seedValue={codeVersion}
            />
          </Container>
        );
      case AppView.CodeExecution:
        return (
          <Container data-cy={CODE_EXECUTION_CONTAINER_CYPRESS}>
            <div>{t('This is the Code Execution panel')}</div>
            <Repl />
            <Button onClick={() => setView(AppView.CodeReview)}>
              {t('Back to Code Review')}
            </Button>
          </Container>
        );
      case AppView.CodeReview:
      default:
        return (
          <ReviewProvider>
            <VisibilityProvider>
              <Container data-cy={CODE_REVIEW_CONTAINER_CYPRESS}>
                <CodeReviewToolbar setView={setView} />
                <CodeReview />
              </Container>
            </VisibilityProvider>
          </ReviewProvider>
        );
    }
  };

  return getContent();
};

export default CodeReviewWrapper;
