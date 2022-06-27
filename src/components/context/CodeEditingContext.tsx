import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { INSTRUCTOR_CODE_VERSION_SETTINGS_KEY } from '../../config/appSettingsTypes';
import {
  CodeContexts,
  DEFAULT_CODE_VERSION_SETTING,
} from '../../config/codeVersions';
import { INSTRUCTOR_CODE_ID } from '../../config/constants';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import {
  DEFAULT_CODE_SETTING,
  DEFAULT_COMMIT_DESCRIPTION_SETTING,
  DEFAULT_COMMIT_MESSAGE_SETTING,
  DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
} from '../../config/settings';
import { CodeType, CodeVersionType } from '../../interfaces/codeVersions';
import { VisibilityVariants } from '../../interfaces/comment';
import { useCodeVersionContext } from './CodeVersionContext';

type AppDataCodeVersionType = {
  data: CodeVersionType;
  type: APP_DATA_TYPES.CODE;
  visibility: VisibilityVariants;
};

export type CodeEditingContextType = {
  editedCode: CodeVersionType;
  setCode: (code: string) => void;
  setLanguage: (code: string) => void;
  setCommitMessage: (message: string) => void;
  setCommitDescription: (description: string) => void;
  submit: () => void;
};

const defaultContextValue: CodeEditingContextType = {
  editedCode: DEFAULT_CODE_VERSION_SETTING,
  setCode: () => null,
  setLanguage: () => null,
  setCommitMessage: () => null,
  setCommitDescription: () => null,
  submit: () => null,
};

export const CodeEditingContext = createContext(defaultContextValue);

type Prop = {
  context: CodeContexts;
};

export const CodeEditingProvider: FC<PropsWithChildren<Prop>> = ({
  context,
  children,
}) => {
  const { codeVersion, setCodeId } = useCodeVersionContext();
  const postAppData = useMutation<
    CodeType,
    unknown,
    unknown,
    AppDataCodeVersionType
  >(MUTATION_KEYS.POST_APP_DATA);
  const postAppSetting = useMutation<
    unknown,
    unknown,
    unknown,
    {
      data: CodeVersionType;
      name: typeof INSTRUCTOR_CODE_VERSION_SETTINGS_KEY;
    }
  >(MUTATION_KEYS.POST_APP_SETTING);
  const appSettings = hooks.useAppSettings();
  const patchAppSetting = useMutation<
    unknown,
    unknown,
    unknown,
    {
      id: string;
      data: CodeVersionType;
    }
  >(MUTATION_KEYS.PATCH_APP_SETTING);
  const [code, setCode] = useState(DEFAULT_CODE_SETTING);
  const [language, setLanguage] = useState(
    DEFAULT_PROGRAMMING_LANGUAGE_SETTING,
  );
  const [commitMessage, setCommitMessage] = useState(
    DEFAULT_COMMIT_MESSAGE_SETTING,
  );
  const [commitDescription, setCommitDescription] = useState(
    DEFAULT_COMMIT_DESCRIPTION_SETTING,
  );
  // console.log(MUTATION_KEYS.POST_APP_SETTING, 'POST appsettings');
  // console.log(MUTATION_KEYS.PATCH_APP_SETTING, 'PATCH appsettings');

  useEffect(
    () => {
      setCode(codeVersion.code);
      setLanguage(codeVersion.language);
      setCommitMessage(DEFAULT_COMMIT_MESSAGE_SETTING);
      setCommitDescription(DEFAULT_COMMIT_DESCRIPTION_SETTING);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [codeVersion],
  );

  const contextValue: CodeEditingContextType = useMemo(
    () => {
      const editedCode = {
        code,
        language,
        commitMessage,
        commitDescription,
      };
      return {
        editedCode,
        setCode,
        setLanguage,
        setCommitMessage,
        setCommitDescription,
        submit: () => {
          const existingAppSettings = appSettings.data?.find(
            (s) => s.name === INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
          );
          switch (context) {
            case CodeContexts.Instructor:
              console.log('hello', typeof existingAppSettings);
              if (existingAppSettings !== undefined) {
                console.log('i will patch');
                patchAppSetting.mutate({
                  data: editedCode,
                  id: existingAppSettings.id,
                });
              } else {
                console.log('i will post');

                postAppSetting.mutate({
                  data: editedCode,
                  name: INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
                });
              }
              setCodeId(INSTRUCTOR_CODE_ID);
              break;
            case CodeContexts.Student:
            default:
              postAppData
                .mutateAsync({
                  data: editedCode,
                  type: APP_DATA_TYPES.CODE,
                })
                .then((data) => setCodeId(data.id));
              break;
          }
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      code,
      language,
      commitMessage,
      commitDescription,
      context,
      appSettings.data,
    ],
  );

  return (
    <CodeEditingContext.Provider value={contextValue}>
      {children}
    </CodeEditingContext.Provider>
  );
};

export const useCodeEditingContext = (): CodeEditingContextType =>
  useContext<CodeEditingContextType>(CodeEditingContext);
