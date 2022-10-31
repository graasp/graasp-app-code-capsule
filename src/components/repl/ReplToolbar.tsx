import { FC } from 'react';

import { PyodideStatus } from '@graasp/pyodide';

import { PlayArrow, Save, Square } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';

import {
  IconDefinition,
  IconLookup,
  findIconDefinition,
  library,
} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  REPLY_SAVE_BUTTON_CY,
  REPL_RUN_CODE_BUTTON_CY,
} from '../../config/selectors';
import ReplStatusIndicator from './ReplStatusIndicator';

library.add(fas);
const broomLookup: IconLookup = { prefix: 'fas', iconName: 'broom' };
const broomIconDefinition: IconDefinition = findIconDefinition(broomLookup);

type Props = {
  onRunCode: () => void;
  onStopCode: () => void;
  onClearOutput: () => void;
  onSaveCode: () => void;
  status: PyodideStatus;
};

const ReplToolbar: FC<Props> = ({
  onRunCode,
  onStopCode,
  onClearOutput,
  onSaveCode,
  status,
}) => {
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
        <Stack direction="row" spacing={1}>
          <Button
            data-cy={REPLY_SAVE_BUTTON_CY}
            variant="outlined"
            startIcon={<Save />}
            onClick={onSaveCode}
          >
            Save
          </Button>
          <LoadingButton
            data-cy={REPL_RUN_CODE_BUTTON_CY}
            variant="outlined"
            loading={isLoading}
            disabled={isRunning}
            startIcon={<PlayArrow />}
            onClick={onRunCode}
          >
            Run
          </LoadingButton>
        </Stack>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={1}
        width="50%"
      >
        <Button
          variant="outlined"
          color="error"
          disabled={!isRunning}
          startIcon={<Square />}
          onClick={onStopCode}
        >
          Stop
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={
            <FontAwesomeIcon icon={broomIconDefinition} color="error" />
          }
          onClick={onClearOutput}
        >
          Clear
        </Button>
      </Stack>
    </Stack>
  );
};
export default ReplToolbar;
