import React, { FC, useEffect, useState } from 'react';

import { APP_MODE_SETTINGS_NAME, AppMode } from '../../config/appSettingsTypes';
import { AppView } from '../../config/layout';
import { CODE_EDITOR_CONTAINER_CYPRESS } from '../../config/selectors';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_APP_VIEW,
} from '../../config/settings';
import { AppModeSettingsKeys } from '../../interfaces/settings';
import CodeReview from '../codeReview/CodeReview';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import { useSettings } from '../context/SettingsContext';
import DiffView from '../diffView/DiffView';
import CodeReviewContainer from '../layout/CodeReviewContainer';
import Repl from '../repl/Repl';
import CodeEditor from './CodeEditor';
import Loader from './Loader';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const AppModeWrapper: FC<Props> = () => {
  const { codeVersion } = useCodeVersionContext();
  const {
    [APP_MODE_SETTINGS_NAME]: appModeSetting = DEFAULT_APP_MODE_SETTINGS,
  } = useSettings();
  const [view, setView] = useState<AppView>(AppView.LoadingView);

  useEffect(() => {
    switch (appModeSetting[AppModeSettingsKeys.Mode]) {
      case AppMode.Execute:
        setView(AppView.CodeExecution);
        break;
      case AppMode.Collaborate:
        setView(AppView.CodeEditor);
        break;
      case AppMode.Review:
        setView(AppView.CodeReview);
        break;
      case AppMode.Explain:
        setView(AppView.DiffView);
        break;
      default:
        setView(DEFAULT_APP_VIEW);
    }
  }, [appModeSetting]);

  switch (view) {
    case AppView.LoadingView:
      return <Loader />;
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
        <Repl
          seedValue={codeVersion}
          onClose={() => setView(AppView.CodeReview)}
        />
      );
    case AppView.DiffView:
      return <DiffView />;
    case AppView.CodeReview:
    default:
      return <CodeReview setView={setView} />;
  }
};

export default AppModeWrapper;
