import { HttpMethod } from '@graasp/sdk';

import { chatBotPostUrl } from '../../src/utils/chatBotUrl';
import { DEFAULT_OPEN_AI_RESPONSE } from '../fixtures/appData';

export const mockOpenAIAPI = (): void => {
  cy.intercept(
    {
      method: HttpMethod.POST,
      url: chatBotPostUrl(Cypress.env().VITE_API_HOST, '*'),
    },
    (req) =>
      req.reply({
        completion: DEFAULT_OPEN_AI_RESPONSE,
      }),
  ).as('openAI');
};
