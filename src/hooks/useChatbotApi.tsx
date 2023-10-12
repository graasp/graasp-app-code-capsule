import { useContext, useEffect, useState } from 'react';

import { TokenContext, useLocalContext } from '@graasp/apps-query-client';

import { OPEN_AI_API_URL } from '@/config/env';

export type UserDataType = { [key: string]: unknown };
type CallbackType = (completion: string, data: UserDataType) => void;
type ReturnType = {
  isLoading: boolean;
  callApi: (prompt: string, userData: UserDataType) => void;
};
export const useChatbotApi = (callback: CallbackType): ReturnType => {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState<UserDataType>({});
  const token = useContext(TokenContext);
  const context = useLocalContext();
  const itemId = context?.get('itemId');
  // because the chatBot is moved behind the base api,
  // the itemId is used to check that the member has access to this item
  const openAiItemUrl = OPEN_AI_API_URL.replace(':itemId', itemId);

  useEffect(
    () => {
      async function fetchApi(): Promise<void> {
        setIsLoading(true);
        fetch(openAiItemUrl, {
          method: 'POST',
          body: JSON.stringify({ prompt }),
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
    chatbotPrompt: string,
    userData: { [key: string]: unknown },
  ): void => {
    setPrompt(chatbotPrompt);
    setData(userData);
    setShouldFetch(true);
  };

  return {
    isLoading,
    callApi,
  };
};
