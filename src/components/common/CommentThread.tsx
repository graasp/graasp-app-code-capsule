import { List } from 'immutable';

import { FC, Fragment } from 'react';

import { APP_ACTIONS_TYPES } from '../../config/appActionsTypes';
import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { GENERAL_SETTINGS_NAME } from '../../config/appSettingsTypes';
import {
  DEFAULT_CHATBOT_PROMPT_APP_DATA,
  MAX_CHATBOT_THREAD_LENGTH,
} from '../../config/constants';
import { MUTATION_KEYS, useMutation } from '../../config/queryClient';
import { COMMENT_THREAD_CONTAINER_CYPRESS } from '../../config/selectors';
import { DEFAULT_GENERAL_SETTINGS } from '../../config/settings';
import { UserDataType, useChatbotApi } from '../../hooks/useChatbotApi';
import { CommentType } from '../../interfaces/comment';
import { GeneralSettingsKeys } from '../../interfaces/settings';
import { buildThread } from '../../utils/comments';
import { useAppDataContext } from '../context/AppDataContext';
import { CommentProvider } from '../context/CommentContext';
import { useReviewContext } from '../context/ReviewContext';
import { useSettings } from '../context/SettingsContext';
import CommentContainer from '../layout/CommentContainer';
import ResponseContainer from '../layout/ResponseContainer';
import Comment from './Comment';
import CommentEditor from './CommentEditor';
import ResponseBox from './ResponseBox';

type Props = {
  children?: List<CommentType>;
  hiddenState: boolean;
};

const CommentThread: FC<Props> = ({ children, hiddenState }) => {
  const {
    addResponse,
    currentRepliedCommentId,
    currentEditedCommentId,
    closeComment,
    closeEditingComment,
  } = useReviewContext();
  const { patchAppData, postAppDataAsync, postAppData } = useAppDataContext();
  const { mutate: postAction } = useMutation<
    unknown,
    unknown,
    { data: unknown; type: string }
  >(MUTATION_KEYS.POST_APP_ACTION);
  const {
    chatbotPrompts,
    [GENERAL_SETTINGS_NAME]: generalSettings = DEFAULT_GENERAL_SETTINGS,
  } = useSettings();

  const { isLoading, callApi } = useChatbotApi(
    (completion: string, data: UserDataType) => {
      // post comment from bot
      postAppData({
        data: { ...data, content: completion },
        type: APP_DATA_TYPES.BOT_COMMENT,
      });
    },
  );

  const isEdited = (id: string): boolean => id === currentEditedCommentId;
  const isReplied = (id: string): boolean => id === currentRepliedCommentId;
  const allowedChatbotResponse = (
    arr: List<CommentType>,
    idx: number,
    commentType: string,
  ): boolean =>
    (arr.size < MAX_CHATBOT_THREAD_LENGTH &&
      commentType === APP_DATA_TYPES.BOT_COMMENT) ||
    // when the comment is a user comment it should not be a response to a chatbot comment
    // -> in this case, we want to wait for the cahtbot response
    (commentType === APP_DATA_TYPES.COMMENT &&
      arr.get(idx - 1)?.type !== APP_DATA_TYPES.BOT_COMMENT);

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
                    maxTextLength={
                      generalSettings[GeneralSettingsKeys.MaxCommentLength]
                    }
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
              {
                // show input bar to respond to comment
                i + 1 === arr.size &&
                  !isEdited(c.id) &&
                  !isReplied(c.id) &&
                  allowedChatbotResponse(arr, i, c.type) && (
                    <ResponseBox commentId={c.id} onClick={addResponse} />
                  )
              }
              {(i + 1 === arr.size && isLoading) ||
                (i + 1 === arr.size &&
                  arr.get(i - 1)?.type === APP_DATA_TYPES.BOT_COMMENT && (
                    <ResponseContainer>Loading</ResponseContainer>
                  ))}
              {
                // if input bar was clicked, a comment editor opens to compose a response
                isReplied(c.id) && (
                  <CommentEditor
                    onCancel={closeComment}
                    onSend={(content) => {
                      const data = {
                        ...c.data,
                        parent: c.id,
                        content,
                      };

                      postAppDataAsync({
                        data,
                        type: APP_DATA_TYPES.COMMENT,
                      })?.then((parent) => {
                        // when in a chatbot thread, should also post to the api
                        if (
                          thread.get(0)?.type === APP_DATA_TYPES.BOT_COMMENT
                        ) {
                          const { chatbotPromptSettingId } =
                            thread.get(0)?.data ||
                            DEFAULT_CHATBOT_PROMPT_APP_DATA;
                          const promptSetting = chatbotPrompts.find(
                            (a) => a.id === chatbotPromptSettingId,
                          );
                          const concatenatedMessages = thread
                            .map((msg) =>
                              msg.type === APP_DATA_TYPES.BOT_COMMENT
                                ? `Chatbot: ${msg.data.content}`
                                : `Étudiant: ${msg.data.content}`,
                            )
                            .join('\n\n');
                          const fullPrompt = `${promptSetting?.data.initialPrompt}\n\n${concatenatedMessages}\n\nÉtudiant: ${content}`;
                          callApi(fullPrompt, {
                            ...data,
                            parent: parent.id,
                          });
                        }
                      });
                      postAction({
                        data,
                        type: APP_ACTIONS_TYPES.RESPOND_COMMENT,
                      });
                      closeComment();
                    }}
                    comment={{ ...c, data: { ...c.data, content: '' } }}
                  />
                )
              }
            </Fragment>
          ))}
        </CommentContainer>
      ))}
    </>
  );
};

export default CommentThread;
