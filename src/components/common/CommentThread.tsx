import React, { FC, Fragment } from 'react';
import { styled, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { List } from 'immutable';
import Comment from './Comment';
import { CommentProvider } from '../context/CommentContext';
import { useReviewContext } from '../context/ReviewContext';
import CommentEditor from './CommentEditor';
import { useAppDataContext } from '../context/AppDataContext';
import { CommentType } from '../../interfaces/comment';
import { buildThread } from '../../utils/comments';
import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { COMMENT_THREAD_CONTAINER_CYPRESS } from '../../config/selectors';

const CommentContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  border: 'solid silver 1px',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
}));

const ResponseContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottomLeftRadius: theme.spacing(1),
  borderBottomRightRadius: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& input': {
    padding: theme.spacing(1),
  },
}));

type Props = {
  children?: List<CommentType>;
  hiddenState: boolean;
};

const CommentThread: FC<Props> = ({ children, hiddenState }) => {
  const { t } = useTranslation();
  const {
    addResponse,
    currentRepliedCommentId,
    currentEditedCommentId,
    closeComment,
    closeEditingComment,
  } = useReviewContext();
  const { patchAppData, postAppData } = useAppDataContext();

  const isEdited = (id: string): boolean => id === currentEditedCommentId;
  const isReplied = (id: string): boolean => id === currentRepliedCommentId;

  if (!children || children?.isEmpty() || hiddenState) {
    return null;
  }

  const threads = children
    .filter((c) => !c.data.parent)
    .map((parent) => buildThread(parent, children))
    .sortBy((thread) => thread.get(0)?.createdAt);

  return (
    <>
      {threads.map((thread) => (
        <CommentContainer
          data-cy={COMMENT_THREAD_CONTAINER_CYPRESS}
          key={`comment-thread-${thread.get(0)?.id}`}
        >
          {thread.map((c, i, arr) => (
            <Fragment key={c.id}>
              <CommentProvider value={c}>
                {isEdited(c.id) ? (
                  <CommentEditor
                    onCancel={() => {
                      closeEditingComment();
                    }}
                    onSend={(content) => {
                      patchAppData({
                        id: c.id,
                        data: {
                          ...c.data,
                          content,
                        },
                      });
                      closeEditingComment();
                    }}
                    comment={c}
                  />
                ) : (
                  <Comment comment={c} />
                )}
              </CommentProvider>
              {i + 1 === arr.size && !isEdited(c.id) && !isReplied(c.id) && (
                <ResponseContainer>
                  <StyledTextField
                    fullWidth
                    placeholder={t('Respond to this comment')}
                    onClick={() => addResponse(c.id)}
                  />
                </ResponseContainer>
              )}
              {isReplied(c.id) && (
                <CommentEditor
                  onCancel={closeComment}
                  onSend={(content) => {
                    postAppData({
                      data: {
                        ...c.data,
                        parent: c.id,
                        content,
                      },
                      type: APP_DATA_TYPES.COMMENT,
                    });
                    closeComment();
                  }}
                  comment={{ ...c, data: { ...c.data, content: '' } }}
                />
              )}
            </Fragment>
          ))}
        </CommentContainer>
      ))}
    </>
  );
};

export default CommentThread;
