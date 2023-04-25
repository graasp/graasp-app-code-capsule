import { HttpMethod } from '@graasp/sdk';

import { DEFAULT_OPEN_AI_RESPONSE } from '../fixtures/appData';

export const mockOpenAIAPI = (): void => {
  cy.intercept(
    {
      method: HttpMethod.POST,
      url: Cypress.env().VITE_OPEN_AI_API_URL,
    },
    (req) =>
      req.reply({
        completion: DEFAULT_OPEN_AI_RESPONSE,
      }),
  ).as('openAI');
};
