import React, { FC, ReactElement, createContext } from 'react';

import { convertJs } from '@graasp/sdk';

import { CommentTypeRecord } from '../../interfaces/comment';

const defaultContextValue = {};
const CommentContext = createContext<CommentTypeRecord>(
  convertJs(defaultContextValue) as CommentTypeRecord,
);

type Prop = {
  value: CommentTypeRecord;
  children: ReactElement;
};

export const CommentProvider: FC<Prop> = ({ children, value }) => (
  <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
);

export const useCommentContext = (): CommentTypeRecord =>
  React.useContext<CommentTypeRecord>(CommentContext);
