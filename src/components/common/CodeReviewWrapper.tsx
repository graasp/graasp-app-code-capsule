import React, { FC, ReactNode, useState } from 'react';

import { Button } from '@graasp/ui';

import { styled } from '@mui/material';

import { AppViews } from '../../config/layout';
import {
  CODE_EDITOR_CONTAINER_CYPRESS,
  CODE_EXECUTION_CONTAINER_CYPRESS,
  CODE_REVIEW_CONTAINER_CYPRESS,
} from '../../config/selectors';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import { ReviewProvider } from '../context/ReviewContext';
import { VisibilityProvider } from '../context/VisibilityContext';
import CodeEditor from './CodeEditor';
import CodeReview from './CodeReview';
import CodeReviewToolbar from './CodeReviewToolbar';

const Container = styled('div')({
  margin: 'auto',
  fontSize: '1.1rem',
  padding: '16px',
  maxWidth: '600px',
  width: '80vw',
  // border: 'solid var(--graasp-primary) 1px',
  borderRadius: '4px',
  wordWrap: 'break-word',
});

// todo: remove this once there are props
// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const CodeReviewWrapper: FC<Props> = () => {
  const [view, setView] = useState<AppViews>(AppViews.CodeReview);
  const { codeVersion } = useCodeVersionContext();

  const getContent = (): ReactNode => {
    switch (view) {
      case AppViews.CodeEditor:
        return (
          <Container data-cy={CODE_EDITOR_CONTAINER_CYPRESS}>
            <CodeEditor
              onClose={() => setView(AppViews.CodeReview)}
              seedValue={codeVersion}
            />
          </Container>
        );
      case AppViews.CodeExecution:
        return (
          <Container data-cy={CODE_EXECUTION_CONTAINER_CYPRESS}>
            <div>This is the Code Execution panel</div>
            <Button onClick={() => setView(AppViews.CodeReview)}>
              Back to CodeReview
            </Button>
          </Container>
        );
      case AppViews.CodeReview:
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

  return <>{getContent()}</>;
};

export default CodeReviewWrapper;
