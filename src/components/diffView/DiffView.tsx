import { FC } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

import { Stack } from '@mui/material';

import { DIFF_VIEW_SETTINGS_NAME } from '../../config/appSettingsTypes';
import { DIFF_VIEW_CONTAINER_CY } from '../../config/selectors';
import { DEFAULT_DIFF_VIEW_SETTINGS } from '../../config/settings';
import { DiffViewSettingsKeys } from '../../interfaces/settings';
import { useSettings } from '../context/SettingsContext';

const DiffView: FC = () => {
  const {
    [DIFF_VIEW_SETTINGS_NAME]: diffViewSettings = DEFAULT_DIFF_VIEW_SETTINGS,
  } = useSettings();

  return (
    <Stack data-cy={DIFF_VIEW_CONTAINER_CY} direction="column" m={2}>
      <ReactDiffViewer
        linesOffset={diffViewSettings[DiffViewSettingsKeys.LinesOffset]}
        oldValue={diffViewSettings[DiffViewSettingsKeys.OldCode]}
        newValue={diffViewSettings[DiffViewSettingsKeys.NewCode]}
      />
    </Stack>
  );
};
export default DiffView;
