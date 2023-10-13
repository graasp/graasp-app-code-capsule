import { useContext, useEffect, useState } from 'react';

import {
  API_ROUTES,
  TokenContext,
  useLocalContext,
} from '@graasp/apps-query-client';
import { ChatBotMessage } from '@graasp/sdk';

import { List } from 'immutable';

import { APP_DATA_TYPES } from '@/config/appDataTypes';
import { ThreadMessage } from '@/interfaces/threadMessage';

const { buildPostChatBotRoute } = API_ROUTES;

export type UserDataType = { [key: string]: unknown };
type CallbackType = (completion: string, data: UserDataType) => void;
type ReturnType = {
  isLoading: boolean;
  callApi: (prompt: Array<ChatBotMessage>, userData: UserDataType) => void;
  buildPrompt: (
    initialPrompt: string | undefined,
    threadMessages: List<ThreadMessage>,
    userMessage: string,
  ) => Array<ChatBotMessage>;
};
export const useChatbotApi = (callback: CallbackType): ReturnType => {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [prompt, setPrompt] = useState<Array<ChatBotMessage>>();
  const [data, setData] = useState<UserDataType>({});
  const token = useContext(TokenContext);
  const context = useLocalContext();
  const apiHost = context?.get('apiHost');
  const itemId = context?.get('itemId');
  const apiUrl = `${apiHost}/${buildPostChatBotRoute(itemId)}`;

  useEffect(
    () => {
      async function fetchApi(): Promise<void> {
        setIsLoading(true);

        fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify(prompt),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            // because the chatBot is behind the api, the auth token is required
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return { completion: 'Sorry, an error occurred' };
          })
          .then((json) => {
            const completion = json.completion
              .trim()
              .replace(/^(Chatbot:)/gm, '');
            callback(completion, data);
            setIsLoading(false);
            setShouldFetch(false);
          });
      }
      if (prompt && shouldFetch) {
        fetchApi();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shouldFetch],
  );

  const callApi = (
    chatbotPrompt: Array<ChatBotMessage>,
    userData: { [key: string]: unknown },
  ): void => {
    setPrompt(chatbotPrompt);
    setData(userData);
    setShouldFetch(true);
  };

  const buildPrompt = (
    initialPrompt: string | undefined,
    threadMessages: List<ThreadMessage>,
    userMessage: string,
  ): Array<ChatBotMessage> => {
    // define the message to send to OpenAI with the initial prompt first if needed (role system).
    // Each call to OpenAI must contain the whole history of the messages.
    const finalPrompt: Array<ChatBotMessage> = initialPrompt
      ? [{ role: 'system', content: initialPrompt }]
      : [];

    threadMessages.forEach((msg) => {
      const msgRole =
        msg.type === APP_DATA_TYPES.BOT_COMMENT ? 'assistant' : 'user';
      finalPrompt.push({ role: msgRole, content: msg.data.content });
    });

    // add the last user's message in the prompt
    finalPrompt.push({ role: 'user', content: userMessage });

    return finalPrompt;
  };

  return {
    isLoading,
    callApi,
    buildPrompt,
  };
};
