import React, { FC, useEffect, useState } from 'react';
import { Box, Stack, styled, TextareaAutosize } from '@mui/material';
import {
  boldCommand,
  codeCommand,
  italicCommand,
  useTextAreaMarkdownEditor,
} from 'react-mde';
import { Code, FormatBold, FormatItalic } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Button } from '@graasp/ui';
import ToolbarButton from '../layout/ToolbarButton';

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
  borderRadius: '4px',
  padding: theme.spacing(2),
  fontSize: '1rem',
  boxSizing: 'border-box',
  resize: 'vertical',
  border: 0,
  outline: 'solid rgba(80, 80, 210, 0.5) 1px',
  width: '100%',
  minWidth: '0',
  minHeight: `calc(1rem + 2*${theme.spacing(2)})`,
  transition: 'outline 250ms ease-in-out',
  '&:focus': {
    outline: 'solid var(--graasp-primary) 2px !important',
  },
  '&:hover': {
    outline: 'solid var(--graasp-primary) 1px ',
  },
}));

type Props = {
  onCancel: () => void;
  onSend: (comment: string) => void;
};

const CommentEditor: FC<Props> = ({ onCancel, onSend }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const { ref, commandController } = useTextAreaMarkdownEditor({
    commandMap: {
      bold: boldCommand,
      italic: italicCommand,
      code: codeCommand,
    },
  });

  // focus textarea on mount
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  });

  return (
    <Box sx={{ my: 1 }}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1}>
          <ToolbarButton
            onClick={async () => {
              await commandController.executeCommand('bold');
            }}
          >
            <FormatBold fontSize="inherit" />
          </ToolbarButton>
          <ToolbarButton
            onClick={async () => {
              await commandController.executeCommand('italic');
            }}
          >
            <FormatItalic fontSize="inherit" />
          </ToolbarButton>
          <ToolbarButton
            onClick={async () => {
              await commandController.executeCommand('code');
            }}
          >
            <Code fontSize="inherit" />
          </ToolbarButton>
        </Stack>
        <TextArea
          placeholder={t('Type your comment')}
          minRows={1}
          maxRows={10}
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Stack direction="row" spacing={1} justifyContent="end">
          <Button color="secondary" onClick={() => onCancel()}>
            {t('Cancel')}
          </Button>
          <Button color="primary" onClick={() => onSend(text)}>
            {t('Send')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CommentEditor;
