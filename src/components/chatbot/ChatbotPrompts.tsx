import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CardContent, CardHeader } from '@mui/material';

import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { GENERAL_SETTINGS_NAME } from '../../config/appSettingsTypes';
import {
  DEFAULT_BOT_USERNAME,
  INSTRUCTOR_CODE_ID,
} from '../../config/constants';
import {
  buildChatbotPromptContainerDataCy,
  buildCommentResponseBoxDataCy,
} from '../../config/selectors';
import { DEFAULT_GENERAL_SETTINGS } from '../../config/settings';
import { UserDataType, useChatbotApi } from '../../hooks/useChatbotApi';
import {
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
  const { postAppDataAsync, postAppData, comments } = useAppDataContext();
  const [openEditor, setOpenEditor] = useState(false);
  // if a message already exists with the prompt id we should not display this prompt
  const {
    chatbotPrompts,
    [GENERAL_SETTINGS_NAME]: generalSettings = DEFAULT_GENERAL_SETTINGS,
  } = useSettings();

  const { callApi } = useChatbotApi(
    (completion: string, data: UserDataType) => {
      // post comment from bot
      postAppData({
        data: { ...data, content: completion },
        type: APP_DATA_TYPES.BOT_COMMENT,
      });
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
    // post chatbot comment as app data with async call
    postAppDataAsync({
      data: {
        line,
        parent: null,
        codeId: INSTRUCTOR_CODE_ID,
        content: chatbotMessage,
        chatbotPromptSettingId: currentLinePrompt?.id,
      },
      type: APP_DATA_TYPES.BOT_COMMENT,
    })?.then((botComment) => {
      // post new user comment as appdata with normal call
      postAppDataAsync({
        data: {
          line,
          parent: botComment.id,
          codeId: INSTRUCTOR_CODE_ID,
          content: newUserComment,
        },
        type: APP_DATA_TYPES.COMMENT,
      })?.then((userMessage) => {
        const fullPrompt = `${currentLinePrompt?.data.initialPrompt}\n\nChatbot: ${chatbotMessage}\n\nÉtudiant: ${newUserComment}`;
        callApi(fullPrompt, {
          line,
          parent: userMessage.id,
          codeId: INSTRUCTOR_CODE_ID,
        });
      });
    });

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
