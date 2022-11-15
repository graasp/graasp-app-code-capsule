import { FC, KeyboardEvent, useContext, useEffect, useState } from 'react';

import { Api, TokenContext, useLocalContext } from '@graasp/apps-query-client';
import { PyWorker, PyodideStatus } from '@graasp/pyodide';

import {
  Alert,
  Box,
  Stack,
  styled,
  experimental_sx as sx,
} from '@mui/material';

import { APP_ACTIONS_TYPES } from '../../config/appActionsTypes';
import { APP_DATA_TYPES } from '../../config/appDataTypes';
import {
  CODE_EXECUTION_SETTINGS_NAME,
  DATA_FILE_LIST_SETTINGS_NAME,
} from '../../config/appSettingsTypes';
import { MUTATION_KEYS, useMutation } from '../../config/queryClient';
import { REPL_CONTAINER_CY, REPL_EDITOR_ID_CY } from '../../config/selectors';
import {
  DEFAULT_CODE_EXECUTION_SETTINGS,
  DEFAULT_DATA_FILE_LIST_SETTINGS,
} from '../../config/settings';
import { CodeVersionType } from '../../interfaces/codeVersions';
import {
  CodeExecutionSettingsKeys,
  DataFileListSettingsKeys,
} from '../../interfaces/settings';
import { sortAppDataFromNewest } from '../../utils/utils';
import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import CodeEditor from './CodeEditor';
import NoobInput from './NoobInput';
import OutputConsole from './OutputConsole';
import ReplToolbar from './ReplToolbar';
import ShowFigures from './ShowFigures';

const OutlineWrapper = styled(Box)(
  sx({
    border: 1,
    borderColor: 'info.main',
    borderRadius: 1,
    // overflow: 'hidden',
  }),
);

type Props = {
  seedValue: CodeVersionType;
  // todo: implement "bo-back" button
  // eslint-disable-next-line react/no-unused-prop-types
  onClose: () => void;
};

const Repl: FC<Props> = ({ seedValue }) => {
  const [worker, setWorker] = useState<PyWorker | null>(null);
  const [output, setOutput] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [figures, setFigures] = useState<string[]>([]);
  const [dataFiles, setDataFiles] = useState<
    { filePath: string; fileText: string }[]
  >([]);
  const [dataFilesReady, setDataFilesReady] = useState(false);
  const [reloadDataFiles, setReloadDataFiles] = useState(true);
  const context = useLocalContext();
  const token = useContext(TokenContext);
  const apiHost = context?.get('apiHost');

  const { mutate: postAction } = useMutation<
    unknown,
    unknown,
    { type: string; data: { [key: string]: unknown } }
  >(MUTATION_KEYS.POST_APP_ACTION);

  const { liveCode, postAppData } = useAppDataContext();
  // sort app data by the latest to the oldest
  const sortedCodeVersions = sortAppDataFromNewest(liveCode);
  const latestCode = sortedCodeVersions.get(0)?.data?.code;
  const currentCode = latestCode || (seedValue ? seedValue.code : '');

  // todo: get value from app data for the user
  const [value, setValue] = useState(currentCode);
  const savedStatus = value === currentCode;
  const {
    [CODE_EXECUTION_SETTINGS_NAME]:
      codeExecSettings = DEFAULT_CODE_EXECUTION_SETTINGS,
    [DATA_FILE_LIST_SETTINGS_NAME]:
      dataFileListSetting = DEFAULT_DATA_FILE_LIST_SETTINGS,
    dataFileSettings,
  } = useSettings();

  const [isExecuting, setIsExecuting] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [replStatus, setReplStatus] = useState<PyodideStatus>(
    PyodideStatus.LOADING_PYODIDE,
  );

  // register worker on mount
  useEffect(
    () => {
      if (codeExecSettings) {
        const workerInstance = new PyWorker(
          'https://spaenleh.github.io/graasp-pyodide/fullWorker.min.js',
        );

        workerInstance.preLoadedPackages =
          codeExecSettings[CodeExecutionSettingsKeys.PreLoadedLibraries].split(
            ' ',
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

        // todo: improve type of function to be able to remove the ts error
        // @ts-ignore
        workerInstance.onError = (newError: { data: string }) => {
          setError(newError.data);
        };

        workerInstance.onTerminated = () => {
          setIsExecuting(false);
          setReplStatus(PyodideStatus.READY);
        };

        workerInstance.onFigure = (figureData) => {
          setFigures((prevFigures) => [...prevFigures, figureData]);
          postAction({
            type: APP_ACTIONS_TYPES.NEW_FIGURE,
            data: { figure: figureData },
          });
        };

        workerInstance.onStatusUpdate = (status: PyodideStatus) => {
          setReplStatus(status);
        };

        // preload worker instance
        workerInstance.preload();

        setWorker(workerInstance);
        postAction({
          type: APP_ACTIONS_TYPES.INITIALIZE_EXECUTION,
          data: {},
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [codeExecSettings],
  );

  // load files when settings are loaded
  useEffect(() => {
    const callback = async (): Promise<void> => {
      if (
        dataFileListSetting[DataFileListSettingsKeys.Files].length &&
        !dataFileSettings.isEmpty() &&
        apiHost &&
        token
      ) {
        const myPromises = dataFileSettings.map(async (f) => {
          const appSettingId = f.id;
          // eslint-disable-next-line no-console
          console.log(`loading data file (id: ${appSettingId})`);
          // find file attributes in the data list setting
          const fileAttributes = dataFileListSetting[
            DataFileListSettingsKeys.Files
          ].find((file) => file.appSettingId === appSettingId);
          // if file attributes were found, load file content
          if (fileAttributes) {
            // todo: add caching
            const fileBlob = await Api.getAppSettingFileContent({
              id: appSettingId,
              apiHost,
              token,
            });
            const fileText = await fileBlob.text();
            const filePath = fileAttributes.virtualPath;
            // eslint-disable-next-line no-console
            console.log(`loading ${filePath}`);
            return { filePath, fileText };
          }
          return null;
        });
        const result = (await Promise.all(myPromises)).filter(Boolean) as {
          filePath: string;
          fileText: string;
        }[];
        // eslint-disable-next-line no-console
        console.log(result);
        setDataFiles(result);
        setDataFilesReady(true);
      }
    };
    callback();
  }, [dataFileListSetting, dataFileSettings, apiHost, token]);

  // load data files when worker is set or reload is requested
  useEffect(
    () => {
      if (worker && dataFilesReady && reloadDataFiles) {
        // eslint-disable-next-line no-console
        console.log('loading files into worker');
        dataFiles.forEach((f) => worker.putFile(f.filePath, f.fileText));
        setReloadDataFiles(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [worker, dataFilesReady, reloadDataFiles],
  );

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
        // post that code was run
        postAction({ type: APP_ACTIONS_TYPES.RUN_CODE, data: { code: value } });
      }
    }
  };

  const onClickClearOutput = (): void => {
    // todo: make sure that the files are reloaded
    worker?.stop();
    worker?.create();
    setReloadDataFiles(true);
    setOutput('');
    setFigures([]);
    worker?.clearOutput();
    // post that the console was cleared
    postAction({ type: APP_ACTIONS_TYPES.CLEAR_OUTPUT, data: {} });
  };

  const onClickStopCode = (): void => {
    if (isWaitingForInput && worker) {
      worker.cancelInput();
      worker.stop();
      setIsWaitingForInput(false);
      postAction({
        type: APP_ACTIONS_TYPES.STOP_EXECUTION_DURING_PROMPT,
        data: { prompt },
      });
    }
    if (isExecuting && worker) {
      worker.stop();
      setIsExecuting(false);
      postAction({
        type: APP_ACTIONS_TYPES.STOP_EXECUTION,
        data: { code: value },
      });
    }
  };

  const onClickValidateInput = (userInput: string): void => {
    if (worker) {
      worker.submitInput(userInput);
      setIsWaitingForInput(false);
      postAction({
        type: APP_ACTIONS_TYPES.SUBMITTED_INPUT,
        data: { input: userInput },
      });
    }
  };

  const onClickCancel = (userInput: string): void => {
    if (worker) {
      worker.cancelInput();
      setIsWaitingForInput(false);
      postAction({
        type: APP_ACTIONS_TYPES.CANCEL_PROMPT,
        data: { input: userInput },
      });
    }
  };

  const onClickSaveCode = (): void => {
    // creates a new app data each time the user saves
    postAppData({ data: { code: value }, type: APP_DATA_TYPES.LIVE_CODE });
    postAction({
      type: APP_ACTIONS_TYPES.SAVE_CODE,
      data: { code: value },
    });
  };

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    // run code using CTRL + ENTER
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      (document.activeElement as HTMLDivElement)?.blur();
      onClickRunCode();
    }

    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      onClickSaveCode();
    }
  };

  return (
    <Stack
      display="flex"
      direction="column"
      height="100vh"
      data-cy={REPL_CONTAINER_CY}
      spacing={1}
      p={2}
    >
      <ReplToolbar
        savedStatus={savedStatus}
        onRunCode={onClickRunCode}
        onStopCode={onClickStopCode}
        onClearOutput={onClickClearOutput}
        onSaveCode={onClickSaveCode}
        status={replStatus}
      />
      <Stack flex={1} direction="row" spacing={1} overflow="hidden">
        <OutlineWrapper
          flex={1}
          overflow="hidden"
          onKeyDown={handleEditorKeyDown}
        >
          <CodeEditor
            id={REPL_EDITOR_ID_CY}
            value={value}
            setValue={setValue}
          />
        </OutlineWrapper>
        <Stack
          display="flex"
          flex={1}
          direction="column"
          spacing={1}
          overflow="hidden"
        >
          <OutlineWrapper display="flex" flex={1} p={1}>
            <OutputConsole output={output} />
            <NoobInput
              prompt={prompt}
              isWaitingForInput={isWaitingForInput}
              onValidate={onClickValidateInput}
              onCancel={onClickCancel}
            />
          </OutlineWrapper>
          <OutlineWrapper>
            <ShowFigures figures={figures} />
          </OutlineWrapper>
        </Stack>
        {error && <Alert color="error">{error}</Alert>}
      </Stack>
    </Stack>
  );
};

export default Repl;
