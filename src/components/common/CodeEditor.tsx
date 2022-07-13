import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppSetting } from '@graasp/apps-query-client';
import { Button } from '@graasp/ui';

import { Stack, TextField, styled } from '@mui/material';

import Editor from '@monaco-editor/react';

import { APP_DATA_TYPES } from '../../config/appDataTypes';
import {
  CodeEditorSubmitTarget,
  INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
} from '../../config/appSettingsTypes';
import { DEFAULT_CODE_VERSION_SETTING } from '../../config/codeVersions';
import { SMALL_BORDER_RADIUS } from '../../config/layout';
import {
  programmingLanguageSelect,
  programmingLanguageSettings,
} from '../../config/programmingLanguages';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import {
  CODE_EDITOR_CANCEL_BUTTON_CYPRESS,
  CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS,
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_LANGUAGE_SELECT_CYPRESS,
  CODE_EDITOR_SUBMIT_BUTTON_CYPRESS,
} from '../../config/selectors';
import {
  DEFAULT_COMMIT_DESCRIPTION_SETTING,
  DEFAULT_COMMIT_MESSAGE_SETTING,
} from '../../config/settings';
import { CodeType, CodeVersionType } from '../../interfaces/codeVersions';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import CustomSelect from '../layout/CustomSelect';
import Loader from './Loader';

const StyledEditor = styled(Editor)({
  padding: '8px',
  border: 'solid silver 1px',
  borderRadius: SMALL_BORDER_RADIUS,
  height: '40vh',
});

type Props = {
  submitTarget?: CodeEditorSubmitTarget;
  seedValue?: CodeVersionType;
  onClose?: () => void;
  showButtonBar?: boolean;
};

const CodeEditor: FC<Props> = ({
  submitTarget = CodeEditorSubmitTarget.Code,
  seedValue,
  onClose = () => null,
  showButtonBar = true,
}) => {
  const { t } = useTranslation();
  const { setCodeId } = useCodeVersionContext();
  const {
    code: seedCode,
    language: seedLanguage,
    commitMessage: seedCommitMessage,
    commitDescription: seedCommitDescription,
  } = seedValue || DEFAULT_CODE_VERSION_SETTING;
  const [language, setLanguage] = useState(seedLanguage);
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
    (res) => res.name === INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
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
        DEFAULT_CODE_VERSION_SETTING;
        setCode(codeSetting);
        setLanguage(languageSetting);
        setCommitMessage(commitMessageSetting);
        setCommitDescription(commitDescriptionSetting);
        break;
      case CodeEditorSubmitTarget.Code:
        // eslint-disable-next-line no-case-declarations
        const { code: newSeedCode, language: newSeedLanguage } =
          seedValue || DEFAULT_CODE_VERSION_SETTING;
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
            name: INSTRUCTOR_CODE_VERSION_SETTINGS_KEY,
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
    <Stack display="flex" direction="column" spacing={1}>
      <CustomSelect
        dataCy={CODE_EDITOR_LANGUAGE_SELECT_CYPRESS}
        onChange={setLanguage}
        value={language}
        label={t('Programming Language')}
        values={programmingLanguageSelect}
      />
      <StyledEditor
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={(value) => onChangeCode(value)}
        options={{
          scrollBeyondLastLine: false,
          detectIndentation: false,
          tabSize: programmingLanguageSettings[language].tabSize,
        }}
        loading={<Loader />}
      />

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
        maxRows={3}
        onChange={({ target }) => onChangeCommitDescription(target.value)}
      />
      {showButtonBar && (
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
      )}
    </Stack>
  );
};

export default CodeEditor;
