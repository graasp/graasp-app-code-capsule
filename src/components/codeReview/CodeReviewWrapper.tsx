import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@graasp/ui';

import { Stack } from '@mui/material';

import { APP_MODE_SETTINGS_NAME, AppMode } from '../../config/appSettingsTypes';
import { AppView } from '../../config/layout';
import {
  CODE_EDITOR_CONTAINER_CYPRESS,
  CODE_EXECUTION_CONTAINER_CYPRESS,
} from '../../config/selectors';
import { DEFAULT_APP_MODE_SETTING } from '../../config/settings';
import { AppModeSettingsKeys } from '../../interfaces/settings';
import CodeEditor from '../common/CodeEditor';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import { useSettings } from '../context/SettingsContext';
import CodeReviewContainer from '../layout/CodeReviewContainer';
import Repl from '../repl/Repl';
import CodeReview from './CodeReview';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const CodeReviewWrapper: FC<Props> = () => {
  const { t } = useTranslation();
  const { codeVersion } = useCodeVersionContext();
  const {
    [APP_MODE_SETTINGS_NAME]: appModeSetting = DEFAULT_APP_MODE_SETTING,
  } = useSettings();
  const [view, setView] = useState<AppView>(AppView.CodeExecution);

  useEffect(() => {
    switch (appModeSetting[AppModeSettingsKeys.Mode]) {
      case AppMode.Execute:
        setView(AppView.CodeExecution);
        break;
      case AppMode.Collaborate:
        setView(AppView.CodeEditor);
        break;
      case AppMode.Review:
      default:
        setView(AppView.CodeReview);
    }
  }, [appModeSetting]);

  const getContent = (): ReactElement => {
    switch (view) {
      case AppView.CodeEditor:
        return (
          <CodeReviewContainer data-cy={CODE_EDITOR_CONTAINER_CYPRESS}>
            <CodeEditor
              onClose={() => setView(AppView.CodeReview)}
              seedValue={codeVersion}
            />
          </CodeReviewContainer>
        );
      case AppView.CodeExecution:
        return (
          <Stack m={2} spacing={2} data-cy={CODE_EXECUTION_CONTAINER_CYPRESS}>
            <Repl seedValue={codeVersion} />
            <Button onClick={() => setView(AppView.CodeReview)}>
              {t('Back to Code Review')}
            </Button>
          </Stack>
        );
      case AppView.CodeReview:
      default:
        return <CodeReview setView={setView} />;
    }
  };

  return getContent();
};

export default CodeReviewWrapper;
