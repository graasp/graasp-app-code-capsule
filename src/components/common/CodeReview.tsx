import React, { FC, Fragment } from 'react';
import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsLight';
import { IconButton, styled } from '@mui/material';
import { Add } from '@mui/icons-material';
import { List } from 'immutable';
import { SETTINGS_KEYS } from '../../interfaces/settings';
import { useReviewContext } from '../context/ReviewContext';
import CommentThread from './CommentThread';
import { APP_DATA_TYPES, APP_DATA_VISIBILITY } from '../../config/appDataTypes';
import { CommentType } from '../../interfaces/comment';
import CommentEditor from './CommentEditor';
import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import { REVIEW_MODE_INDIVIDUAL } from '../../config/constants';
import {
  buildAddButtonDataCy,
  CODE_REVIEW_ADD_BUTTON_CYPRESS,
  CODE_REVIEW_LINE_CYPRESS,
} from '../../config/selectors';
import { buildCodeRowKey } from '../../utils/utils';
import { useVisibilityContext } from '../context/VisibilityContext';

const Code = styled('div')({
  margin: 0,
  background: 'transparent !important',
});

const Line = styled('pre')({
  display: 'table-row',
  whiteSpace: 'pre-wrap',
  margin: 0,
  // make the "add" button appear when hovering on the line
  '&:hover button': {
    opacity: 1,
  },
});

const LineNoContainer = styled('div')({
  display: 'table-cell',
  paddingRight: '1em',
  minWidth: '5rem',
  textAlign: 'right',
  whiteSpace: 'nowrap',
  userSelect: 'none',
});

const LineNo = styled('span')({
  opacity: 0.5,
  minWidth: '3rem',
  textAlign: 'right',
  paddingRight: '1rem',
});

const addButtonHoverStyle = {
  opacity: 1,
  backgroundColor: 'var(--graasp-primary)',
  transition: 'transform .1s ease-in-out',
  transform: 'scale(1, 1)',
  '& svg': {
    fill: 'white',
  },
};

const AddButton = styled(IconButton)({
  height: '1.5rem',
  width: '1.5rem',
  opacity: 0.3,
  borderRadius: '4px',
  // shrink the icon to have the spring out effect
  transform: 'scale(0.8, 0.8)',
  '&:hover': addButtonHoverStyle,
});

type Props = {
  allowReplies?: boolean;
  allowComments?: boolean;
  code: string;
  language: string;
};

const CodeReview: FC<Props> = ({ code, language }) => {
  const { addComment, multilineRange, currentCommentLine, closeComment } =
    useReviewContext();
  const { lineHiddenState } = useVisibilityContext();
  const { settings } = useSettings();
  const allowComments = settings[SETTINGS_KEYS.ALLOW_COMMENTS];
  const reviewMode = settings[SETTINGS_KEYS.REVIEW_MODE];
  const { postAppData, appData } = useAppDataContext();

  const comments = appData?.filter(
    (res) => res.type === APP_DATA_TYPES.COMMENT,
  ) as List<CommentType>;

  const groupedComments = comments?.groupBy(({ data }) => data.line);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    i: number,
  ): void => {
    if (e.shiftKey) {
      addComment(i + 1, true);
      return;
    }
    addComment(i + 1);
  };

  return (
    <Highlight
      Prism={defaultProps.Prism}
      theme={theme}
      code={code}
      language={language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Code className={className} style={style}>
          {tokens.map((line, i) => (
            // container to host the line and the comment thread
            <Fragment key={buildCodeRowKey(line, i)}>
              <Line
                data-cy={CODE_REVIEW_LINE_CYPRESS}
                id={buildCodeRowKey(line, i)}
                {...getLineProps({
                  line,
                  key: i,
                })}
              >
                <LineNoContainer>
                  <LineNo>{i + 1}</LineNo>
                  {allowComments && (
                    <AddButton
                      data-cy={CODE_REVIEW_ADD_BUTTON_CYPRESS}
                      button-cy={buildAddButtonDataCy(i + 1)}
                      size="medium"
                      sx={
                        // add hover style on buttons that are in the selected line range
                        (multilineRange?.end &&
                          multilineRange?.start &&
                          multilineRange?.start <= i &&
                          multilineRange?.end > i) ||
                        currentCommentLine - 1 === i ||
                        (multilineRange?.start || 0) - 1 === i
                          ? addButtonHoverStyle
                          : null
                      }
                      onClick={(e) => handleClick(e, i)}
                    >
                      <Add fontSize="inherit" color="primary" />
                    </AddButton>
                  )}
                </LineNoContainer>
                {line.map((token, key) => (
                  <span
                    key={`code-${key + 1}-${line}`}
                    {...getTokenProps({
                      token,
                      key,
                    })}
                  />
                ))}
                {
                  // show line toggle button
                }
              </Line>
              {
                // currentCommentLine is 1-indexed while the index i is 0-indexed
                currentCommentLine - 1 === i && (
                  <CommentEditor
                    onCancel={closeComment}
                    onSend={(text) => {
                      postAppData({
                        data: {
                          content: text,
                          line: i + 1,
                          // comment on top level has no parent
                          parent: null,
                          ...(multilineRange?.start &&
                            multilineRange?.end && {
                              multiline: multilineRange,
                            }),
                        },
                        type: APP_DATA_TYPES.COMMENT,
                        visibility:
                          reviewMode === REVIEW_MODE_INDIVIDUAL
                            ? APP_DATA_VISIBILITY.MEMBER
                            : APP_DATA_VISIBILITY.ITEM,
                      });
                      closeComment();
                    }}
                  />
                )
              }
              <CommentThread hiddenState={lineHiddenState[i]}>
                {groupedComments.get(i + 1)?.toList() as List<CommentType>}
              </CommentThread>
            </Fragment>
          ))}
        </Code>
      )}
    </Highlight>
  );
};

export default CodeReview;
