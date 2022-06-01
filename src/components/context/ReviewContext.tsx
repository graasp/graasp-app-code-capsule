import React, {
  createContext,
  FC,
  ReactElement,
  useMemo,
  useState,
} from 'react';

const NO_COMMENT_OPENED = -1;

export type ReviewContextType = {
  addComment: (lineNumber: number) => void;
  currentCommentLine: number;
  closeComment: () => void;
};

const defaultContextValue = {
  addComment: (lineNumber: number) =>
    console.log(`comment added on ${lineNumber}`),
  currentCommentLine: NO_COMMENT_OPENED,
  closeComment: () => console.log(`comment closed`),
};
const ReviewContext = createContext<ReviewContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const ReviewProvider: FC<Prop> = ({ children }) => {
  const [currentCommentLine, setCurrentCommentLine] =
    useState<number>(NO_COMMENT_OPENED);
  const contextValue = useMemo(
    () => ({
      addComment: (lineNumber: number) => setCurrentCommentLine(lineNumber),
      currentCommentLine,
      closeComment: () => setCurrentCommentLine(NO_COMMENT_OPENED),
    }),
    [currentCommentLine],
  );

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = (): ReviewContextType =>
  React.useContext<ReviewContextType>(ReviewContext);
