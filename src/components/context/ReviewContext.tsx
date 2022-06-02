import React, {
  createContext,
  FC,
  ReactElement,
  useMemo,
  useState,
} from 'react';

const NO_COMMENT_OPENED = -1;
const NO_COMMENT_EDITED = '';

export type ReviewContextType = {
  addComment: (lineNumber: number) => void;
  editComment: (commentId: string) => void;
  currentCommentLine: number;
  currentEditedCommentId: string;
  closeComment: () => void;
  closeEditingComment: () => void;
};

const defaultContextValue = {
  addComment: (lineNumber: number) =>
    console.log(`comment added on ${lineNumber}`),
  editComment: (commentId: string) =>
    console.log(`comment with id ${commentId} is edited`),
  currentCommentLine: NO_COMMENT_OPENED,
  currentEditedCommentId: NO_COMMENT_EDITED,
  closeComment: () => console.log(`comment closed`),
  closeEditingComment: () => console.log(`comment finished editing`),
};
const ReviewContext = createContext<ReviewContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const ReviewProvider: FC<Prop> = ({ children }) => {
  const [currentCommentLine, setCurrentCommentLine] =
    useState<number>(NO_COMMENT_OPENED);
  const [currentEditedCommentId, setCurrentEditedCommentId] =
    useState<string>(NO_COMMENT_EDITED);
  const contextValue = useMemo(
    () => ({
      addComment: (lineNumber: number) => setCurrentCommentLine(lineNumber),
      editComment: (commentId: string) => setCurrentEditedCommentId(commentId),
      currentCommentLine,
      currentEditedCommentId,
      closeComment: () => setCurrentCommentLine(NO_COMMENT_OPENED),
      closeEditingComment: () => setCurrentEditedCommentId(NO_COMMENT_EDITED),
    }),
    [currentCommentLine, currentEditedCommentId],
  );

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = (): ReviewContextType =>
  React.useContext<ReviewContextType>(ReviewContext);
