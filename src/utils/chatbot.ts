import { API_ROUTES } from '@graasp/apps-query-client';
import { ChatBotMessage, ChatbotRole } from '@graasp/sdk';

import { List } from 'immutable';

import { APP_DATA_TYPES } from '@/config/appDataTypes';
import { ThreadMessage } from '@/interfaces/threadMessage';

const { buildPostChatBotRoute } = API_ROUTES;

export const chatBotPostUrl = (apiHost: string, itemId: string): string =>
  `${apiHost}/${buildPostChatBotRoute(itemId)}`;

export const buildPrompt = (
  initialPrompt: string | undefined,
  threadMessages: List<ThreadMessage>,
  userMessage: string,
): Array<ChatBotMessage> => {
  // define the message to send to OpenAI with the initial prompt first if needed (role system).
  // Each call to OpenAI must contain the whole history of the messages.
  const finalPrompt: Array<ChatBotMessage> = initialPrompt
    ? [{ role: ChatbotRole.System, content: initialPrompt }]
    : [];

  threadMessages.forEach((msg) => {
    const msgRole =
      msg.type === APP_DATA_TYPES.BOT_COMMENT
        ? ChatbotRole.Assistant
        : ChatbotRole.User;
    finalPrompt.push({ role: msgRole, content: msg.data.content });
  });

  // add the last user's message in the prompt
  finalPrompt.push({ role: ChatbotRole.User, content: userMessage });

  return finalPrompt;
};
