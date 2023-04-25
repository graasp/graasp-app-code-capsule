import React, {
  FC,
  ReactElement,
  createContext,
  useMemo,
  useState,
} from 'react';

export const NO_COMMENT_OPENED = -1;
const NO_COMMENT_EDITED = '';

type MultilineRange = {
  start: number;
  end: number;
};

const defaultMultilineRange = {
  start: NO_COMMENT_OPENED,
  end: NO_COMMENT_OPENED,
};

export type ReviewContextType = {
  addComment: (lineNumber: number, multiline?: boolean) => void;
  addResponse: (commentId: string) => void;
  editComment: (commentId: string) => void;
  currentCommentLine: number;
  multilineRange: MultilineRange;
  currentEditedCommentId: string;
  currentRepliedCommentId: string;
  closeComment: () => void;
  closeEditingComment: () => void;
};

const defaultContextValue = {
  addComment: (lineNumber: number, multiline?: boolean) =>
    // eslint-disable-next-line no-console
    console.log(`comment added on ${lineNumber} (multiline: ${multiline})`),
  addResponse: (commentId: string) =>
    // eslint-disable-next-line no-console
    console.log(`response added to ${commentId}`),
  editComment: (commentId: string) =>
    // eslint-disable-next-line no-console
    console.log(`comment with id ${commentId} is edited`),
  currentCommentLine: NO_COMMENT_OPENED,
  multilineRange: defaultMultilineRange,
  currentEditedCommentId: NO_COMMENT_EDITED,
  currentRepliedCommentId: NO_COMMENT_EDITED,
  // eslint-disable-next-line no-console
  closeComment: () => console.log(`comment closed`),
  // eslint-disable-next-line no-console
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
  const [currentRepliedCommentId, setCurrentRepliedCommentId] =
    useState<string>(NO_COMMENT_EDITED);
  const [multilineRange, setMultilineRange] = useState<MultilineRange>(
    defaultMultilineRange,
  );
  const contextValue = useMemo(
    () => ({
      addComment: (lineNumber: number, multiline?: boolean) => {
        // comment is multiline
        if (multiline) {
          switch (true) {
            // multiline start is not set -> first click
            case multilineRange.start === NO_COMMENT_OPENED:
              // multiline start
              setMultilineRange((prevState) => ({
                ...prevState,
                start: lineNumber,
              }));
              break;

            // multiline stop
            case lineNumber === multilineRange.start:
              // line is same as start -> convert to single line comment
              setMultilineRange(defaultMultilineRange);
              setCurrentCommentLine(lineNumber);
              break;

            case lineNumber < multilineRange.start:
              // invert range
              setMultilineRange({
                end: multilineRange.start,
                start: lineNumber,
              });
              // set last line as the comment line
              setCurrentCommentLine(multilineRange.start);
              break;

            case lineNumber > multilineRange.start:
              setMultilineRange((prevState) => ({
                ...prevState,
                end: lineNumber,
              }));
              setCurrentCommentLine(lineNumber);
              break;

            default:
              setCurrentCommentLine(lineNumber);
          }
        } else {
          // comment is single line
          // reset multiline range
          setMultilineRange(defaultMultilineRange);
          // set the single comment line
          setCurrentCommentLine(lineNumber);
        }
      },
      addResponse: (commentId: string) => {
        setCurrentRepliedCommentId(commentId);
      },
      editComment: (commentId: string) => setCurrentEditedCommentId(commentId),
      currentCommentLine,
      multilineRange,
      currentEditedCommentId,
      currentRepliedCommentId,
      closeComment: () => {
        setMultilineRange(defaultMultilineRange);
        setCurrentCommentLine(NO_COMMENT_OPENED);
        setCurrentRepliedCommentId(NO_COMMENT_EDITED);
      },
      closeEditingComment: () => setCurrentEditedCommentId(NO_COMMENT_EDITED),
    }),
    [
      currentCommentLine,
      currentEditedCommentId,
      currentRepliedCommentId,
      multilineRange,
    ],
  );

  return (
    <ReviewContext.Provider value={contextValue}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = (): ReviewContextType =>
  React.useContext<ReviewContextType>(ReviewContext);
