import React, {
  createContext,
  FC,
  ReactElement,
  useMemo,
  useState,
} from 'react';

const NO_COMMENT_OPENED = -1;
const NO_COMMENT_EDITED = '';

type MultilineRange = {
  start?: number;
  end?: number;
};

const defaultMultilineRange = null;

export type ReviewContextType = {
  addComment: (lineNumber: number, multiline?: boolean) => void;
  editComment: (commentId: string) => void;
  currentCommentLine: number;
  multilineRange: MultilineRange | null;
  currentEditedCommentId: string;
  closeComment: () => void;
  closeEditingComment: () => void;
};

const defaultContextValue = {
  addComment: (lineNumber: number, multiline?: boolean) =>
    console.log(`comment added on ${lineNumber} (multiline: ${multiline})`),
  editComment: (commentId: string) =>
    console.log(`comment with id ${commentId} is edited`),
  currentCommentLine: NO_COMMENT_OPENED,
  multilineRange: defaultMultilineRange,
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
  const [multilineRange, setMultilineRange] = useState<MultilineRange | null>(
    null,
  );
  const contextValue = useMemo(
    () => ({
      addComment: (lineNumber: number, multiline?: boolean) => {
        if (multiline) {
          if (!multilineRange?.start) {
            // multiline start
            setMultilineRange({ start: lineNumber });
            return;
          }
          // multiline stop
          if (lineNumber === multilineRange?.start) {
            // line is same as start -> convert to single line comment
            setMultilineRange(defaultMultilineRange);
            setCurrentCommentLine(lineNumber);
            return;
          }
          if (lineNumber < multilineRange?.start) {
            // invert range
            setMultilineRange({
              end: multilineRange?.start,
              start: lineNumber,
            });
            setCurrentCommentLine(multilineRange?.start);
            return;
          }
          setMultilineRange({ ...multilineRange, end: lineNumber });
          setCurrentCommentLine(lineNumber);
          return;
        }
        setMultilineRange(defaultMultilineRange);
        setCurrentCommentLine(lineNumber);
      },
      editComment: (commentId: string) => setCurrentEditedCommentId(commentId),
      currentCommentLine,
      multilineRange,
      currentEditedCommentId,
      closeComment: () => {
        setMultilineRange(null);
        setCurrentCommentLine(NO_COMMENT_OPENED);
      },
      closeEditingComment: () => setCurrentEditedCommentId(NO_COMMENT_EDITED),
    }),
    [currentCommentLine, currentEditedCommentId, multilineRange],
  );

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = (): ReviewContextType =>
  React.useContext<ReviewContextType>(ReviewContext);
