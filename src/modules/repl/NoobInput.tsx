import { FC, KeyboardEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

import {
  REPL_INPUT_DIALOG_BUTTON_CONTAINER_CY,
  REPL_INPUT_DIALOG_CANCEL_BUTTON_CY,
  REPL_INPUT_DIALOG_PROMPT_TEXT_CY,
  REPL_INPUT_DIALOG_SUBMIT_BUTTON_CY,
  REPL_INPUT_DIALOG_TEXTFIELD_CY,
} from '../../config/selectors';

type Props = {
  prompt: string;
  isWaitingForInput: boolean;
  onValidate: (input: string) => void;
  onCancel: (input: string) => void;
};

const NoobInput: FC<Props> = ({
  prompt,
  isWaitingForInput,
  onValidate,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [userInput, setUserInput] = useState('');

  const onChange = ({
    target: { value },
  }: {
    target: { value: string };
  }): void => {
    setUserInput(value);
  };

  const resetUserInput = (): void => {
    setUserInput('');
  };

  const handleSubmitInput = (): void => {
    onValidate(userInput);
    resetUserInput();
  };

  const handleCancelInput = (): void => {
    onCancel(userInput);
    resetUserInput();
  };

  const onKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      handleSubmitInput();
      event.preventDefault();
    } else if (event.ctrlKey && event.key === 'c') {
      handleCancelInput();
      event.preventDefault();
    }
  };

  // reset input when the value of the boolean changes
  useEffect(() => {
    resetUserInput();
  }, [isWaitingForInput]);

  return (
    <Dialog open={isWaitingForInput} onClose={handleCancelInput}>
      <DialogTitle>{t('Input requested')}</DialogTitle>
      <DialogContent>
        <DialogContentText
          data-cy={REPL_INPUT_DIALOG_PROMPT_TEXT_CY}
          sx={{ whiteSpace: 'pre', mb: 2 }}
        >
          {prompt}
        </DialogContentText>
        <TextField
          data-cy={REPL_INPUT_DIALOG_TEXTFIELD_CY}
          autoFocus
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyPress}
        />
      </DialogContent>
      <DialogActions data-cy={REPL_INPUT_DIALOG_BUTTON_CONTAINER_CY}>
        <Button
          sx={{ m: 1 }}
          data-cy={REPL_INPUT_DIALOG_CANCEL_BUTTON_CY}
          onClick={handleCancelInput}
          color="error"
          variant="outlined"
        >
          {t('Cancel')}
        </Button>
        <Button
          sx={{ m: 1 }}
          data-cy={REPL_INPUT_DIALOG_SUBMIT_BUTTON_CY}
          onClick={handleSubmitInput}
          variant="outlined"
        >
          {t('Submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoobInput;
