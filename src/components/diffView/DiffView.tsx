import { FC, useEffect, useRef, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

import { useLocalContext } from '@graasp/apps-query-client';

import { Stack } from '@mui/material';

import { DIFF_VIEW_SETTINGS_NAME } from '../../config/appSettingsTypes';
import { DIFF_VIEW_CONTAINER_CY } from '../../config/selectors';
import { DEFAULT_DIFF_VIEW_SETTINGS } from '../../config/settings';
import { DiffViewSettingsKeys } from '../../interfaces/settings';
import { useSettings } from '../context/SettingsContext';

const ADAPT_HEIGHT_TIMEOUT = 50;

const DiffView: FC = () => {
  const {
    [DIFF_VIEW_SETTINGS_NAME]: diffViewSettings = DEFAULT_DIFF_VIEW_SETTINGS,
  } = useSettings();
  const context = useLocalContext();
  const rootRef = useRef();
  const [height, setHeight] = useState(0);

  const adaptHeight = (): void => {
    // set timeout to leave time for the height to be set
    setTimeout(() => {
      // adapt height when not in standalone (so when in an iframe)
      if (!context?.get('standalone')) {
        // get height from the root element and add a small margin
        // @ts-ignore
        const clientRect = rootRef?.current?.getBoundingClientRect();
        if (window.frameElement && clientRect) {
          const newHeight = clientRect.height;
          if (height !== newHeight) {
            setHeight(newHeight);
            // @ts-ignore
            window.frameElement.style['min-height'] = `${newHeight}px`;
            // @ts-ignore
            window.frameElement.style.overflowY = 'hidden';
            // @ts-ignore
            window.frameElement.scrolling = 'no';
            // @ts-ignore
            window.frameElement.style.height = `${newHeight}px`;
          }
        }
      }
    }, ADAPT_HEIGHT_TIMEOUT);
  };

  useEffect(
    () => {
      adaptHeight();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Stack data-cy={DIFF_VIEW_CONTAINER_CY} direction="column" ref={rootRef}>
      <ReactDiffViewer
        linesOffset={diffViewSettings[DiffViewSettingsKeys.LinesOffset]}
        oldValue={diffViewSettings[DiffViewSettingsKeys.OldCode]}
        newValue={diffViewSettings[DiffViewSettingsKeys.NewCode]}
      />
    </Stack>
  );
};
export default DiffView;
