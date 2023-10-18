import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CardContent, CardHeader } from '@mui/material';

import { UserDataType } from '@graasp/apps-query-client';

import { List } from 'immutable';

import { ThreadMessage } from '@/interfaces/threadMessage';

import { APP_ACTIONS_TYPES } from '../../config/appActionsTypes';
import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { GENERAL_SETTINGS_NAME } from '../../config/appSettingsTypes';
import {
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
  ChatbotPromptSettingsKeys,
  GeneralSettingsKeys,
} from '../../interfaces/settings';
import { buildPrompt } from '../../utils/chatbot';
import CommentBody from '../common/CommentBody';
import CommentEditor from '../common/CommentEditor';
import ResponseBox from '../common/ResponseBox';
import { useAppDataContext } from '../context/AppDataContext';
import { useLoadingIndicator } from '../context/LoadingIndicatorContext';
import { useSettings } from '../context/SettingsContext';
import CommentContainer from '../layout/CommentContainer';
import CustomCommentCard from '../layout/CustomCommentCard';
import ChatbotAvatar from './ChatbotAvatar';

const { useChatbotApi } = hooks;

type Props = {
  line: number;
};

const ChatbotPrompts: FC<Props> = ({ line }) => {
  const { t } = useTranslation();
  const { postAppDataAsync, comments } = useAppDataContext();
  const [openEditor, setOpenEditor] = useState(false);
  const { mutate: postAction } = mutations.usePostAppAction();
  // if a message already exists with the prompt id we should not display this prompt
  const {
    chatbotPrompts,
    [GENERAL_SETTINGS_NAME]: generalSettings = DEFAULT_GENERAL_SETTINGS,
  } = useSettings();
  const { startLoading, stopLoading } = useLoadingIndicator();

  const { callApi } = useChatbotApi(
    (completion: string, data: UserDataType) => {
      const newData = { ...data, content: completion };
      // post comment from bot
      postAppDataAsync({
        data: newData,
        type: APP_DATA_TYPES.BOT_COMMENT,
      })?.then(() => stopLoading());
      postAction({ data: newData, type: APP_ACTIONS_TYPES.CREATE_COMMENT });
    },
  );

  const currentLinePrompt = chatbotPrompts.find(
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
    startLoading();
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
        const threadMessages: List<ThreadMessage> = List([
          {
            type: APP_DATA_TYPES.BOT_COMMENT,
            data: { content: chatbotMessage },
          },
        ]);

        const prompt = buildPrompt(
          currentLinePrompt?.data.initialPrompt,
          threadMessages,
          newUserComment,
        );

        callApi(prompt, {
          line,
          parent: userMessage?.id,
          codeId: INSTRUCTOR_CODE_ID,
        });
        postAction({
          data: { prompt },
          type: APP_ACTIONS_TYPES.SEND_PROMPT,
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
