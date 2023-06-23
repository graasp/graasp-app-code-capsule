import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress, Stack, Typography } from '@mui/material';

import { List } from 'immutable';

import { APP_ACTIONS_TYPES } from '../../config/appActionsTypes';
import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { GENERAL_SETTINGS_NAME } from '../../config/appSettingsTypes';
import {
  DEFAULT_CHATBOT_PROMPT_APP_DATA,
  MAX_CHATBOT_THREAD_LENGTH,
} from '../../config/constants';
import { mutations } from '../../config/queryClient';
import { COMMENT_THREAD_CONTAINER_CYPRESS } from '../../config/selectors';
import { DEFAULT_GENERAL_SETTINGS } from '../../config/settings';
import { UserDataType, useChatbotApi } from '../../hooks/useChatbotApi';
import { CommentTypeRecord } from '../../interfaces/comment';
import { GeneralSettingsKeys } from '../../interfaces/settings';
import { buildThread } from '../../utils/comments';
import { useAppDataContext } from '../context/AppDataContext';
import { CommentProvider } from '../context/CommentContext';
import { useLoadingIndicator } from '../context/LoadingIndicatorContext';
import { useReviewContext } from '../context/ReviewContext';
import { useSettings } from '../context/SettingsContext';
import CommentContainer from '../layout/CommentContainer';
import ResponseContainer from '../layout/ResponseContainer';
import Comment from './Comment';
import CommentEditor from './CommentEditor';
import ResponseBox from './ResponseBox';

type Props = {
  children?: List<CommentTypeRecord>;
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
  const { patchAppData, postAppDataAsync } = useAppDataContext();
  const { mutate: postAction } = mutations.usePostAppAction();
  const {
    chatbotPrompts,
    [GENERAL_SETTINGS_NAME]: generalSettings = DEFAULT_GENERAL_SETTINGS,
  } = useSettings();
  const { isLoading, startLoading, stopLoading } = useLoadingIndicator();

  const { callApi } = useChatbotApi(
    (completion: string, data: UserDataType) => {
      // post comment from bot
      const newData = { ...data, content: completion };
      postAppDataAsync({
        data: newData,
        type: APP_DATA_TYPES.BOT_COMMENT,
      })?.then(() => {
        stopLoading();
      });
      postAction({ data: newData, type: APP_ACTIONS_TYPES.CREATE_COMMENT });
    },
  );

  const isEdited = (id: string): boolean => id === currentEditedCommentId;
  const isReplied = (id: string): boolean => id === currentRepliedCommentId;
  const allowedChatbotResponse = (
    arr: List<CommentTypeRecord>,
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
                  !isLoading &&
                  !isEdited(c.id) &&
                  !isReplied(c.id) &&
                  allowedChatbotResponse(arr, i, c.type) && (
                    <ResponseBox commentId={c.id} onClick={addResponse} />
                  )
              }
              {i + 1 === arr.size && isLoading && (
                <ResponseContainer>
                  <Stack spacing={2} direction="row" justifyContent="center">
                    <Typography color="#666">{t('Loading')}</Typography>
                    <CircularProgress sx={{ color: '#666' }} size="20px" />
                  </Stack>
                </ResponseContainer>
              )}
              {
                // if input bar was clicked, a comment editor opens to compose a response
                isReplied(c.id) && (
                  <CommentEditor
                    onCancel={closeComment}
                    onSend={(content) => {
                      startLoading();
                      const data = {
                        ...c.data.toJS(),
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
                          const fullPrompt = `${promptSetting?.data.initialPrompt}\n\n${concatenatedMessages}\n\nÉtudiant: ${content}\n\n`;

                          callApi(fullPrompt, {
                            ...data,
                            parent: parent?.id,
                          });
                          postAction({
                            data: { prompt: fullPrompt },
                            type: APP_ACTIONS_TYPES.SEND_PROMPT,
                          });
                        }
                      });
                      postAction({
                        data,
                        type: APP_ACTIONS_TYPES.RESPOND_COMMENT,
                      });
                      closeComment();
                    }}
                    comment={c.setIn(['data', 'content'], '')}
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
