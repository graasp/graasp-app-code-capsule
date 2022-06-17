import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@graasp/ui';

import { Stack, TextField, styled } from '@mui/material';

import Editor from '@monaco-editor/react';

import {
  programmingLanguageSelect,
  programmingLanguageSettings,
} from '../../config/programmingLanguages';
import {
  CODE_EDITOR_CANCEL_BUTTON_CYPRESS,
  CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS,
  CODE_EDITOR_COMMIT_MESSAGE_CYPRESS,
  CODE_EDITOR_LANGUAGE_SELECT_CYPRESS,
  CODE_EDITOR_SUBMIT_BUTTON_CYPRESS,
} from '../../config/selectors';
import { useCodeEditingContext } from '../context/CodeEditingContext';
import CustomSelect from '../layout/CustomSelect';
import Loader from './Loader';

const StyledEditor = styled(Editor)({
  padding: '8px',
  border: 'solid silver 1px',
  borderRadius: '4px',
  height: '40vh',
});

type Props = {
  onClose?: () => void;
  showButtonBar?: boolean;
};

const CodeEditor: FC<Props> = ({
  onClose = () => null,
  showButtonBar = true,
}) => {
  const { t } = useTranslation();
  const {
    editedCode,
    setCode,
    setCommitDescription,
    setCommitMessage,
    setLanguage,
    submit,
  } = useCodeEditingContext();

  const onSubmitCode = (): void => {
    submit();
    onClose?.();
  };
  const onChangeCode = (value?: string): void => {
    if (value) {
      setCode(value);
    }
  };
  const onChangeCommitMessage = (value: string): void => {
    setCommitMessage(value);
  };
  const onChangeCommitDescription = (value: string): void => {
    setCommitDescription(value);
  };

  console.log(editedCode);
  return (
    <Stack display="flex" direction="column" spacing={1}>
      <CustomSelect
        dataCy={CODE_EDITOR_LANGUAGE_SELECT_CYPRESS}
        onChange={setLanguage}
        value={editedCode.language}
        label={t('Programming Language')}
        values={programmingLanguageSelect}
      />
      <StyledEditor
        defaultLanguage={editedCode.language}
        language={editedCode.language}
        value={editedCode.code}
        onChange={(value) => onChangeCode(value)}
        options={{
          scrollBeyondLastLine: false,
          detectIndentation: false,
          tabSize: programmingLanguageSettings[editedCode.language].tabSize,
        }}
        loading={<Loader />}
      />

      <TextField
        data-cy={CODE_EDITOR_COMMIT_MESSAGE_CYPRESS}
        value={editedCode.commitMessage}
        label={t('Commit Message')}
        placeholder={t('Commit Message')}
        onChange={({ target }) => onChangeCommitMessage(target.value)}
      />
      <TextField
        data-cy={CODE_EDITOR_COMMIT_DESCRIPTION_CYPRESS}
        value={editedCode.commitDescription}
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
