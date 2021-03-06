import { List } from 'immutable';
import Highlight, { Language, defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsLight';

import React, { FC, Fragment } from 'react';

import { Add } from '@mui/icons-material';
import { IconButton, styled } from '@mui/material';

import { APP_DATA_TYPES, APP_DATA_VISIBILITY } from '../../config/appDataTypes';
import { REVIEW_MODE_INDIVIDUAL } from '../../config/constants';
import { SMALL_BORDER_RADIUS } from '../../config/layout';
import {
  CODE_REVIEW_ADD_BUTTON_CYPRESS,
  CODE_REVIEW_LINE_CONTENT_CYPRESS,
  CODE_REVIEW_LINE_CYPRESS,
  buildAddButtonDataCy,
} from '../../config/selectors';
import { CommentType } from '../../interfaces/comment';
import { SETTINGS_KEYS } from '../../interfaces/settings';
import { buildCodeRowKey } from '../../utils/utils';
import { useAppDataContext } from '../context/AppDataContext';
import { useCodeVersionContext } from '../context/CodeVersionContext';
import { useReviewContext } from '../context/ReviewContext';
import { useSettings } from '../context/SettingsContext';
import { useVisibilityContext } from '../context/VisibilityContext';
import CommentEditor from './CommentEditor';
import CommentThread from './CommentThread';

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
  borderRadius: SMALL_BORDER_RADIUS,
  // shrink the icon to have the spring out effect
  transform: 'scale(0.8, 0.8)',
  '&:hover': addButtonHoverStyle,
});

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

const CodeReview: FC<Props> = () => {
  const { addComment, multilineRange, currentCommentLine, closeComment } =
    useReviewContext();
  const { codeVersion, codeId } = useCodeVersionContext();
  const { code, language } = codeVersion;
  const { lineHiddenState } = useVisibilityContext();
  const { settings } = useSettings();
  const allowComments = settings[SETTINGS_KEYS.ALLOW_COMMENTS];
  const reviewMode = settings[SETTINGS_KEYS.REVIEW_MODE];
  const { postAppData, comments } = useAppDataContext();

  const versionComments = comments?.filter((c) => c.data.codeId === codeId);

  const groupedComments = versionComments?.groupBy(({ data }) => data.line);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    i: number,
  ): void => {
    // support multiline selection by holding shift on click
    if (e.shiftKey) {
      addComment(i, true);
      return;
    }
    addComment(i);
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
                      button-cy={buildAddButtonDataCy(i)}
                      size="medium"
                      sx={
                        // add hover style on buttons that are in the selected line range
                        (multilineRange?.end &&
                          multilineRange?.start &&
                          multilineRange?.start <= i &&
                          multilineRange?.end > i) ||
                        currentCommentLine === i ||
                        (multilineRange?.start || 0) === i
                          ? addButtonHoverStyle
                          : null
                      }
                      onClick={(e) => handleClick(e, i)}
                    >
                      <Add fontSize="inherit" color="primary" />
                    </AddButton>
                  )}
                </LineNoContainer>
                <div data-cy={CODE_REVIEW_LINE_CONTENT_CYPRESS}>
                  {line.map((token, key) => (
                    <span
                      key={`code-${key}-${line}`}
                      {...getTokenProps({
                        token,
                        key,
                      })}
                    />
                  ))}
                </div>
                {
                  // todo: show line toggle button
                }
              </Line>
              {currentCommentLine === i && (
                <CommentEditor
                  onCancel={closeComment}
                  onSend={(text) => {
                    postAppData({
                      data: {
                        content: text,
                        line: i,
                        // codeId corresponding to current code version
                        codeId,
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
              )}
              <CommentThread hiddenState={lineHiddenState[i]}>
                {groupedComments.get(i)?.toList() as List<CommentType>}
              </CommentThread>
            </Fragment>
          ))}
        </Code>
      )}
    </Highlight>
  );
};

export default CodeReview;
