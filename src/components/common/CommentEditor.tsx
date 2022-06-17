import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  boldCommand,
  codeCommand,
  italicCommand,
  linkCommand,
  quoteCommand,
  useTextAreaMarkdownEditor,
} from 'react-mde';

import { Button } from '@graasp/ui';

import {
  Code,
  FormatBold,
  FormatItalic,
  FormatQuote,
  InsertLink,
} from '@mui/icons-material';
import {
  Box,
  Stack,
  TextareaAutosize,
  Typography,
  styled,
} from '@mui/material';

import {
  COMMENT_EDITOR_BOLD_BUTTON_CYPRESS,
  COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS,
  COMMENT_EDITOR_CODE_BUTTON_CYPRESS,
  COMMENT_EDITOR_CYPRESS,
  COMMENT_EDITOR_ITALIC_BUTTON_CYPRESS,
  COMMENT_EDITOR_LINE_INFO_TEXT_CYPRESS,
  COMMENT_EDITOR_LINK_BUTTON_CYPRESS,
  COMMENT_EDITOR_QUOTE_BUTTON_CYPRESS,
  COMMENT_EDITOR_SAVE_BUTTON_CYPRESS,
  COMMENT_EDITOR_TEXTAREA_CYPRESS,
} from '../../config/selectors';
import { CommentType } from '../../interfaces/comment';
import { useReviewContext } from '../context/ReviewContext';
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
  comment?: CommentType;
};

const CommentEditor: FC<Props> = ({ onCancel, onSend, comment }) => {
  const { t } = useTranslation();
  const { multilineRange, currentCommentLine } = useReviewContext();
  const [text, setText] = useState(comment?.data.content ?? '');
  const { ref, commandController } = useTextAreaMarkdownEditor({
    commandMap: {
      bold: boldCommand,
      italic: italicCommand,
      code: codeCommand,
      link: linkCommand,
      quote: quoteCommand,
    },
  });

  const multiline = comment?.data.multiline ?? multilineRange;

  // focus textarea on mount
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  });

  return (
    <Box sx={{ p: 1 }} data-cy={COMMENT_EDITOR_CYPRESS}>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={1}>
          <ToolbarButton
            dataCy={COMMENT_EDITOR_BOLD_BUTTON_CYPRESS}
            onClick={async () => {
              await commandController.executeCommand('bold');
            }}
          >
            <FormatBold fontSize="inherit" />
          </ToolbarButton>
          <ToolbarButton
            dataCy={COMMENT_EDITOR_ITALIC_BUTTON_CYPRESS}
            onClick={async () => {
              await commandController.executeCommand('italic');
            }}
          >
            <FormatItalic fontSize="inherit" />
          </ToolbarButton>
          <ToolbarButton
            dataCy={COMMENT_EDITOR_CODE_BUTTON_CYPRESS}
            onClick={async () => {
              await commandController.executeCommand('code');
            }}
          >
            <Code fontSize="inherit" />
          </ToolbarButton>
          <ToolbarButton
            dataCy={COMMENT_EDITOR_LINK_BUTTON_CYPRESS}
            onClick={async () => {
              await commandController.executeCommand('link');
            }}
          >
            <InsertLink fontSize="inherit" />
          </ToolbarButton>
          <ToolbarButton
            dataCy={COMMENT_EDITOR_QUOTE_BUTTON_CYPRESS}
            onClick={async () => {
              await commandController.executeCommand('quote');
            }}
          >
            <FormatQuote fontSize="inherit" />
          </ToolbarButton>
        </Stack>
        <TextArea
          data-cy={COMMENT_EDITOR_TEXTAREA_CYPRESS}
          placeholder={t('Type your comment')}
          minRows={1}
          maxRows={10}
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Stack
          data-cy={COMMENT_EDITOR_LINE_INFO_TEXT_CYPRESS}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {multiline ? (
            <Typography>{t('MultiLineComment', multiline)}</Typography>
          ) : (
            <Typography>
              {t('LineComment', {
                line: comment?.data.line ?? currentCommentLine,
              })}
            </Typography>
          )}
          <Stack direction="row" spacing={1} justifyContent="end">
            <Button
              dataCy={COMMENT_EDITOR_CANCEL_BUTTON_CYPRESS}
              color="secondary"
              variant="outlined"
              onClick={() => onCancel()}
            >
              {t('Cancel')}
            </Button>
            <Button
              dataCy={COMMENT_EDITOR_SAVE_BUTTON_CYPRESS}
              color="primary"
              variant="outlined"
              onClick={() => onSend(text)}
            >
              {t('Send')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CommentEditor;
