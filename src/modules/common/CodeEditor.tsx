import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Stack, TextField, styled, useTheme } from '@mui/material';

import { AppSetting } from '@graasp/apps-query-client';
import { Button } from '@graasp/ui';

import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import CodeMirror from '@uiw/react-codemirror';

import { APP_DATA_TYPES } from '../../config/appDataTypes';
import {
  CodeEditorSubmitTarget,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../../config/appSettingsTypes';
import { SMALL_BORDER_RADIUS } from '../../config/layout';
import {
  ProgrammingLanguagesType,
  programmingLanguageSelect,
} from '../../config/programmingLanguages';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import {
  CODE_EDITOR_CANCEL_BUTTON_CYPRESS,
  CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS,
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_ID_CY,
  CODE_EDITOR_LANGUAGE_SELECT_CYPRESS,
  CODE_EDITOR_SUBMIT_BUTTON_CYPRESS,
} from '../../config/selectors';
import {
  DEFAULT_COMMIT_DESCRIPTION_SETTING,
  DEFAULT_COMMIT_MESSAGE_SETTING,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../../config/settings';
import { CodeType, CodeVersionType } from '../../interfaces/codeVersions';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import CustomSelect from '../layout/CustomSelect';

const StyledEditorContainer = styled(Box)({
  border: 'solid silver 1px',
  borderRadius: SMALL_BORDER_RADIUS,
  maxHeight: '40vh',
  overflow: 'hidden',
});

type Props = {
  submitTarget?: CodeEditorSubmitTarget;
  seedValue?: CodeVersionType;
  onClose?: () => void;
};

const CodeEditor: FC<Props> = ({
  submitTarget = CodeEditorSubmitTarget.Code,
  seedValue,
  onClose = () => null,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { setCodeId } = useCodeVersionContext();
  const {
    code: seedCode,
    language: seedLanguage,
    commitMessage: seedCommitMessage,
    commitDescription: seedCommitDescription,
  } = seedValue || DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS;
  const [language, setLanguage] =
    useState<ProgrammingLanguagesType>(seedLanguage);
  const [code, setCode] = useState(seedCode);
  const [commitMessage, setCommitMessage] = useState(seedCommitMessage);
  const [commitDescription, setCommitDescription] = useState(
    seedCommitDescription,
  );

  const { mutate: postSettings } = useMutation<
    unknown,
    unknown,
    Partial<AppSetting>
  >(MUTATION_KEYS.POST_APP_SETTING);
  const { mutate: patchSettings } = useMutation<
    unknown,
    unknown,
    Partial<AppSetting>
  >(MUTATION_KEYS.PATCH_APP_SETTING);
  const { mutateAsync: postAppData } = useMutation<
    CodeType,
    unknown,
    Partial<CodeType>
  >(MUTATION_KEYS.POST_APP_DATA);
  const appSettingsQuery = hooks.useAppSettings();
  const codeVersionSettings = appSettingsQuery.data?.find(
    (res) => res.name === INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
  );

  useEffect(() => {
    switch (submitTarget) {
      case CodeEditorSubmitTarget.Settings:
        // eslint-disable-next-line no-case-declarations
        const {
          code: codeSetting,
          language: languageSetting,
          commitMessage: commitMessageSetting,
          commitDescription: commitDescriptionSetting,
        } = (codeVersionSettings?.data as CodeVersionType) ||
        DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS;
        setCode(codeSetting);
        setLanguage(languageSetting);
        setCommitMessage(commitMessageSetting);
        setCommitDescription(commitDescriptionSetting);
        break;
      case CodeEditorSubmitTarget.Code:
        // eslint-disable-next-line no-case-declarations
        const { code: newSeedCode, language: newSeedLanguage } =
          seedValue || DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS;
        setCode(newSeedCode);
        setLanguage(newSeedLanguage);
        setCommitMessage(DEFAULT_COMMIT_MESSAGE_SETTING);
        setCommitDescription(DEFAULT_COMMIT_DESCRIPTION_SETTING);
        break;
      default:
        break;
    }
  }, [submitTarget, codeVersionSettings, seedValue]);

  const onSubmitCode = (): void => {
    const editedCodeData = {
      code,
      language,
      commitMessage,
      commitDescription,
    };
    switch (submitTarget) {
      case CodeEditorSubmitTarget.Settings:
        // settings already exists
        if (codeVersionSettings) {
          patchSettings({
            data: editedCodeData,
            id: codeVersionSettings.id,
          });
        } else {
          // create setting
          postSettings({
            data: editedCodeData,
            name: INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
          });
        }
        break;
      case CodeEditorSubmitTarget.Code:
        postAppData({
          data: editedCodeData,
          type: APP_DATA_TYPES.CODE,
        }).then((data) => setCodeId(data.id));
        break;
      default:
        break;
    }
    onClose?.();
  };
  const onChangeCode = (value?: string): void => {
    // allow to save an empty string value but not null or undefined
    if (value || value === '') {
      setCode(value);
    }
  };
  const onChangeCommitMessage = (value: string): void => {
    setCommitMessage(value);
  };
  const onChangeCommitDescription = (value: string): void => {
    setCommitDescription(value);
  };
  return (
    <Stack display="flex" direction="column" spacing={1} maxHeight="100%">
      <CustomSelect
        dataCy={CODE_EDITOR_LANGUAGE_SELECT_CYPRESS}
        onChange={(newLanguage: ProgrammingLanguagesType) =>
          setLanguage(newLanguage)
        }
        value={language}
        label={t('Programming Language')}
        values={programmingLanguageSelect}
      />
      <StyledEditorContainer>
        <CodeMirror
          id={CODE_EDITOR_ID_CY}
          onChange={(value) => onChangeCode(value)}
          height="100%"
          style={{
            height: '100%',
          }}
          theme={theme.palette.mode}
          basicSetup
          extensions={[python(), javascript(), java()]}
        />
      </StyledEditorContainer>

      <TextField
        data-cy={CODE_EDITOR_COMMIT_MESSAGE_CYPRESS}
        value={commitMessage}
        label={t('Commit Message')}
        placeholder={t('Commit Message')}
        onChange={({ target }) => onChangeCommitMessage(target.value)}
      />
      <TextField
        data-cy={CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS}
        value={commitDescription}
        label={t('Optional Extended Description')}
        placeholder={t('Optional Extended Description')}
        multiline
        maxRows={2}
        onChange={({ target }) => onChangeCommitDescription(target.value)}
      />

      <Stack direction="row" justifyContent="end" spacing={1}>
        <Button
          dataCy={CODE_EDITOR_CANCEL_BUTTON_CYPRESS}
          onClick={onClose}
          color="error"
          variant="outlined"
        >
          {t('Cancel')}
        </Button>
        <Button
          dataCy={CODE_EDITOR_SUBMIT_BUTTON_CYPRESS}
          variant="outlined"
          onClick={() => onSubmitCode()}
        >
          {t('Submit Code')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default CodeEditor;
