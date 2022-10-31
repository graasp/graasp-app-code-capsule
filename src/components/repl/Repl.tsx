import { FC, useEffect, useState } from 'react';

import { PyWorker, PyodideStatus } from '@graasp/pyodide';

import { Alert, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { CODE_EXECUTION_SETTINGS_NAME } from '../../config/appSettingsTypes';
import { MAX_REPL_HEIGHT } from '../../config/layout';
import { REPL_CONTAINER_CY, REPL_EDITOR_ID_CY } from '../../config/selectors';
import { DEFAULT_CODE_EXECUTION_SETTINGS } from '../../config/settings';
import { CodeVersionType } from '../../interfaces/codeVersions';
import { CodeExecutionSettingsKeys } from '../../interfaces/settings';
import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import CodeEditor from './CodeEditor';
import InputArea from './InputArea';
import ReplToolbar from './ReplToolbar';
import ShowFigures from './ShowFigures';

type Props = {
  seedValue: CodeVersionType;
};

const Repl: FC<Props> = ({ seedValue }) => {
  const [worker, setWorker] = useState<PyWorker | null>(null);
  const [output, setOutput] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const [figures, setFigures] = useState<string[]>([]);

  const { codeAppData } = useAppDataContext();
  // sort app data by the latest to the oldest
  const sortedCodeVersions = codeAppData.sort((a, b) =>
    Date.parse(a.updatedAt) > Date.parse(b.updatedAt) ? 1 : -1,
  );
  const latestCode = sortedCodeVersions.get(0)?.data?.code || '';

  const currentCode = seedValue ? seedValue.code : latestCode;

  // todo: get value from app data for the user
  const [value, setValue] = useState(currentCode);

  const {
    [CODE_EXECUTION_SETTINGS_NAME]:
      codeExecSettings = DEFAULT_CODE_EXECUTION_SETTINGS,
  } = useSettings();

  const [isExecuting, setIsExecuting] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [replStatus, setReplStatus] = useState<PyodideStatus>(
    PyodideStatus.LOADING_PYODIDE,
  );

  // register worker on mount
  useEffect(() => {
    // todo: reconciliate the concat output option
    const workerInstance = new PyWorker(
      'https://spaenleh.github.io/graasp-pyodide/fullWorker.min.js',
    );

    workerInstance.onOutput = (newOutput: string, append = false) => {
      setOutput((prevOutput) =>
        append ? `${prevOutput}${newOutput}` : newOutput,
      );
    };

    workerInstance.onInput = (newPrompt: string) => {
      setIsWaitingForInput(true);
      setPrompt(newPrompt);
    };

    workerInstance.onError = (newError) => {
      // eslint-disable-next-line no-console
      console.error(newError);
      // setError(newError.data);
    };

    workerInstance.onTerminated = () => {
      setIsExecuting(false);
      setReplStatus(PyodideStatus.READY);
    };

    workerInstance.onFigure = (figureData) => {
      setFigures((prevFigures) => [...prevFigures, figureData]);
    };

    workerInstance.onStatusUpdate = (status: PyodideStatus) => {
      setReplStatus(status);
    };

    // preload worker instance
    workerInstance.preload();

    setWorker(workerInstance);
  }, []);

  const onClickRunCode = (): void => {
    // to run the code:
    // - previous run must be done
    // - worker must be set
    // - value must be true
    if (!isExecuting && worker) {
      const headerCode = codeExecSettings[CodeExecutionSettingsKeys.HeaderCode];
      const footerCode = codeExecSettings[CodeExecutionSettingsKeys.FooterCode];
      const fullCode = `${headerCode}\n${value}\n${footerCode}`;
      if (fullCode.trim()) {
        setIsExecuting(true);
        // reset output
        worker.clearOutput();
        setOutput('');
        worker.run(fullCode);
      }
    }
  };

  const onClickClearOutput = (): void => {
    setOutput('');
    setFigures([]);
    worker?.clearOutput();
  };

  const onClickStopCode = (): void => {
    if (isWaitingForInput && worker) {
      worker.cancelInput();
      worker.stop();
      setIsWaitingForInput(false);
    }
    if (isExecuting && worker) {
      worker.stop();
      setIsExecuting(false);
    }
  };

  const onClickValidateInput = (userInput: string): void => {
    if (worker) {
      worker.submitInput(userInput);
      setIsWaitingForInput(false);
    }
  };

  const onClickCancel = (): void => {
    if (worker) {
      worker.cancelInput();
      setIsWaitingForInput(false);
    }
  };

  const onClickSaveCode = (): void => {
    // todo: logic to save to app data
  };

  return (
    <Stack direction="column" spacing={1} data-cy={REPL_CONTAINER_CY}>
      <ReplToolbar
        onRunCode={onClickRunCode}
        onStopCode={onClickStopCode}
        onClearOutput={onClickClearOutput}
        onSaveCode={onClickSaveCode}
        status={replStatus}
      />
      <Grid container direction="row">
        <Grid
          xs
          sx={{
            mr: 0.5,
            border: 1,
            borderRadius: 1,
            borderColor: 'error.main',
            height: MAX_REPL_HEIGHT,
            overflow: 'hidden',
          }}
        >
          <CodeEditor
            id={REPL_EDITOR_ID_CY}
            value={value}
            setValue={setValue}
          />
        </Grid>
        <Grid
          container
          xs
          direction="column"
          sx={{
            ml: 0.5,
            height: MAX_REPL_HEIGHT,
          }}
        >
          <Grid
            xs
            display="flex"
            sx={{
              p: 1,
              overflow: 'hidden',
              mb: 0.5,
              border: 1,
              borderRadius: 1,
              borderColor: 'info.main',
              width: '100%',
            }}
          >
            <InputArea
              onValidate={onClickValidateInput}
              onCancel={onClickCancel}
              prompt={output + (isWaitingForInput ? prompt : '')}
              readOnly={!isWaitingForInput}
            />
          </Grid>
          <Grid
            xs
            display="flex"
            overflow="hidden"
            sx={{
              mt: 0.5,
              border: 1,
              borderRadius: 1,
              borderColor: 'info.main',
            }}
          >
            <ShowFigures figures={figures} />
          </Grid>
        </Grid>
      </Grid>
      {error && <Alert color="error">{error}</Alert>}
    </Stack>
  );
};

export default Repl;
