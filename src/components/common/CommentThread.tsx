import React, { FC, Fragment } from 'react';
import { styled, TextField } from '@mui/material';
import { AppData } from '@graasp/apps-query-client/dist/src/types';
import { useTranslation } from 'react-i18next';
import Comment from './Comment';
import { CommentAppData } from '../../interfaces/comment';
import { CommentProvider } from '../context/CommentContext';
import { useReviewContext } from '../context/ReviewContext';
import CommentEditor from './CommentEditor';
import { useAppDataContext } from '../context/AppDataContext';

const CommentContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  border: 'solid silver 1px',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
}));

type Props = {
  children?: (AppData & CommentAppData)[];
};

const CommentThread: FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const { currentEditedCommentId, closeEditingComment } = useReviewContext();
  const { patchAppData } = useAppDataContext();

  const isEdited = (id: string): boolean => id === currentEditedCommentId;

  if (children?.length) {
    return (
      <CommentContainer>
        {children?.map((c, i, arr) => (
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
                  value={c.data?.content}
                />
              ) : (
                <Comment comment={c} />
              )}
            </CommentProvider>
            {i + 1 === arr.length && !isEdited(c.id) && (
              <ResponseContainer>
                <TextField
                  fullWidth
                  placeholder={t('Respond to this comment')}
                />
              </ResponseContainer>
            )}
          </Fragment>
        ))}
      </CommentContainer>
    );
  }
  return null;
};

export default CommentThread;
