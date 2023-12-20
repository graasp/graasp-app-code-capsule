import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CardContent, CardHeader } from '@mui/material';

import { ChatbotThreadMessage, buildPrompt } from '@graasp/apps-query-client';

import { APP_ACTIONS_TYPES } from '../../config/appActionsTypes';
import { APP_DATA_TYPES } from '../../config/appDataTypes';
import {
  CHATBOT_PROMPT_SETTINGS_NAME,
  GENERAL_SETTINGS_NAME,
} from '../../config/appSettingsTypes';
import {
  CHAT_BOT_ERROR_MESSAGE,
  DEFAULT_BOT_USERNAME,
  INSTRUCTOR_CODE_ID,
} from '../../config/constants';
import { hooks, mutations } from '../../config/queryClient';
import {
  buildChatbotPromptContainerDataCy,
  buildCommentResponseBoxDataCy,
} from '../../config/selectors';
import { DEFAULT_GENERAL_SETTINGS } from '../../config/settings';
import {
  ChatbotPromptSettings,
  ChatbotPromptSettingsKeys,
  GeneralSettingsKeys,
} from '../../interfaces/settings';
import CommentBody from '../common/CommentBody';
import CommentEditor from '../common/CommentEditor';
import ResponseBox from '../common/ResponseBox';
import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import CommentContainer from '../layout/CommentContainer';
import CustomCommentCard from '../layout/CustomCommentCard';
import ChatbotAvatar from './ChatbotAvatar';

type Props = {
  line: number;
};

const ChatbotPrompts: FC<Props> = ({ line }) => {
  const { t } = useTranslation();
  const { postAppDataAsync, comments } = useAppDataContext();
  const [openEditor, setOpenEditor] = useState(false);
  const { mutate: postAction } = mutations.usePostAppAction();
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();
  // if a message already exists with the prompt id we should not display this prompt
  const {
    [GENERAL_SETTINGS_NAME]: generalSettings = DEFAULT_GENERAL_SETTINGS,
  } = useSettings();
  const { data: chatbotPrompts } = hooks.useAppSettings<ChatbotPromptSettings>({
    name: CHATBOT_PROMPT_SETTINGS_NAME,
  });

  const currentLinePrompt = chatbotPrompts?.find(
    (c) => c.data[ChatbotPromptSettingsKeys.LineNumber] === line,
  );

  if (!currentLinePrompt) {
    return null;
  }

  const realChatbotPromptExists = comments.find(
    (c) =>
      c.data.chatbotPromptSettingId !== undefined &&
      c.data.chatbotPromptSettingId === currentLinePrompt.id,
  );

  const handleNewDiscussion = (newUserComment: string): void => {
    const chatbotMessage = currentLinePrompt?.data.chatbotPrompt;
    const newData = {
      line,
      parent: null,
      codeId: INSTRUCTOR_CODE_ID,
      content: chatbotMessage,
      chatbotPromptSettingId: currentLinePrompt?.id,
    };
    // post chatbot comment as app data with async call
    postAppDataAsync({
      data: newData,
      type: APP_DATA_TYPES.BOT_COMMENT,
    })?.then((botComment) => {
      const userData = {
        line,
        parent: botComment?.id,
        codeId: INSTRUCTOR_CODE_ID,
        content: newUserComment,
      };
      // post new user comment as appdata with normal call
      postAppDataAsync({
        data: userData,
        type: APP_DATA_TYPES.COMMENT,
      })?.then((userMessage) => {
        const threadMessages: ChatbotThreadMessage[] = [
          {
            botDataType: APP_DATA_TYPES.BOT_COMMENT,
            msgType: APP_DATA_TYPES.BOT_COMMENT,
            data: chatbotMessage,
          },
        ];

        const prompt = buildPrompt(
          currentLinePrompt?.data.initialPrompt,
          threadMessages,
          newUserComment,
        );

        postAction({
          data: { prompt },
          type: APP_ACTIONS_TYPES.SEND_PROMPT,
        });

        const actionData = {
          line,
          parent: userMessage?.id,
          codeId: INSTRUCTOR_CODE_ID,
          content: CHAT_BOT_ERROR_MESSAGE,
        };

        postChatBot(prompt)
          .then((chatBotRes) => {
            actionData.content = chatBotRes.completion;
          })
          .finally(() => {
            // post comment from bot
            postAppDataAsync({
              data: actionData,
              type: APP_DATA_TYPES.BOT_COMMENT,
            });
            postAction({
              data: actionData,
              type: APP_ACTIONS_TYPES.CREATE_COMMENT,
            });
          });
      });
      postAction({ data: userData, type: APP_ACTIONS_TYPES.CREATE_COMMENT });
    });
    postAction({ data: newData, type: APP_ACTIONS_TYPES.CREATE_COMMENT });

    // close editor
    setOpenEditor(false);
  };

  // display only if real chatbot promp does not exist yet
  if (!realChatbotPromptExists) {
    return (
      <CommentContainer>
        <CustomCommentCard
          elevation={0}
          data-cy={buildChatbotPromptContainerDataCy(currentLinePrompt.id)}
        >
          <CardHeader
            title={DEFAULT_BOT_USERNAME}
            subheader={t('just now')}
            avatar={<ChatbotAvatar />}
          />
          <CardContent sx={{ p: 2, py: 0, '&:last-child': { pb: 0 } }}>
            <CommentBody>{currentLinePrompt.data.chatbotPrompt}</CommentBody>
          </CardContent>
        </CustomCommentCard>

        {openEditor ? (
          <CommentEditor
            maxTextLength={
              generalSettings[GeneralSettingsKeys.MaxCommentLength]
            }
            onCancel={() => setOpenEditor(false)}
            onSend={handleNewDiscussion}
          />
        ) : (
          <ResponseBox
            dataCy={buildCommentResponseBoxDataCy(currentLinePrompt.id)}
            onClick={() => setOpenEditor(true)}
            commentId={currentLinePrompt.id}
          />
        )}
      </CommentContainer>
    );
  }
  return null;
};
export default ChatbotPrompts;
