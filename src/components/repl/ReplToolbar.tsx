import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PyodideStatus } from '@graasp/pyodide';

import {
  Fullscreen,
  FullscreenExit,
  PlayArrow,
  Save,
  Square,
} from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

import {
  IconDefinition,
  IconLookup,
  findIconDefinition,
  library,
} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  REPL_CLEAR_BUTTON_CY,
  REPL_FULL_SCREEN_BUTTON_CY,
  REPL_RUN_CODE_BUTTON_CY,
  REPL_SAVE_BUTTON_CY,
  REPL_STOP_BUTTON_CY,
} from '../../config/selectors';
import MiniButton from '../layout/MiniButton';
import ReplStatusIndicator from './ReplStatusIndicator';

library.add(fas);
const broomLookup: IconLookup = { prefix: 'fas', iconName: 'broom' };
const broomIconDefinition: IconDefinition = findIconDefinition(broomLookup);

type Props = {
  onRunCode: () => void;
  onStopCode: () => void;
  onClearOutput: () => void;
  onSaveCode: () => void;
  onFullscreen: () => void;
  status: PyodideStatus;
  savedStatus: boolean;
  isFullscreen: boolean;
};

const ReplToolbar: FC<Props> = ({
  onRunCode,
  onStopCode,
  onClearOutput,
  onSaveCode,
  onFullscreen,
  status,
  savedStatus,
  isFullscreen,
}) => {
  const { t } = useTranslation();
  const isLoading = [
    PyodideStatus.LOADING_MODULE,
    PyodideStatus.LOADING_PYODIDE,
    PyodideStatus.INSTALLING,
    PyodideStatus.ERROR,
  ].includes(status);
  const isRunning = [PyodideStatus.RUNNING, PyodideStatus.WAIT_INPUT].includes(
    status,
  );

  return (
    <Stack direction="row" spacing={1}>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        width="50%"
      >
        <ReplStatusIndicator status={status} />
        <Stack direction="row" spacing={1} alignItems="center">
          {!savedStatus && (
            <Typography variant="caption">
              {t('Unsaved modifications')}
            </Typography>
          )}
          <MiniButton
            dataCy={REPL_SAVE_BUTTON_CY}
            icon={<Save />}
            onClick={onSaveCode}
            disabled={savedStatus}
            tooltip={t('Save Code')}
            text={savedStatus ? t('Saved') : t('Save')}
          />
          <MiniButton
            dataCy={REPL_RUN_CODE_BUTTON_CY}
            isLoading={isLoading}
            disabled={isRunning}
            icon={<PlayArrow />}
            onClick={onRunCode}
            text={t('Run')}
            tooltip={t('Run Code')}
          />
        </Stack>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={1}
        width="50%"
      >
        <MiniButton
          dataCy={REPL_STOP_BUTTON_CY}
          color="error"
          disabled={!isRunning}
          icon={<Square />}
          onClick={onStopCode}
          text={t('Stop')}
          tooltip={t('Stop Execution')}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <MiniButton
            dataCy={REPL_FULL_SCREEN_BUTTON_CY}
            color="primary"
            icon={isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            onClick={onFullscreen}
            tooltip={t('Toggle Fullscreen')}
            text={t('Fullscreen')}
          />
          <MiniButton
            dataCy={REPL_CLEAR_BUTTON_CY}
            color="error"
            icon={
              <FontAwesomeIcon
                icon={broomIconDefinition}
                color="error"
                width="24px"
                height="24px"
              />
            }
            onClick={onClearOutput}
            tooltip={t('Clear outputs and figures')}
            text={t('Clear')}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};
export default ReplToolbar;
