import React, { FC, Fragment } from 'react';
import { styled } from '@mui/material';
import { AppData } from '@graasp/apps-query-client/dist/src/types';
import Comment from './Comment';
import { CommentAppData } from '../../interfaces/comment';
import { CommentProvider } from '../context/CommentContext';

const CommentContainer = styled('div')(({ theme }) => ({
  border: 'solid silver 1px',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
}));

type Props = {
  children?: (AppData & CommentAppData)[];
};

const CommentThread: FC<Props> = ({ children }) => {
  if (children?.length) {
    return (
      <CommentContainer>
        {children?.map((c) => (
          <Fragment key={c.id}>
            <CommentProvider value={c}>
              <Comment comment={c} />
            </CommentProvider>
          </Fragment>
        ))}
        Here should be an input field
      </CommentContainer>
    );
  }
  return null;
};

export default CommentThread;
