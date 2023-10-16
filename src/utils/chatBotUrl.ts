import { API_ROUTES } from '@graasp/apps-query-client';

const { buildPostChatBotRoute } = API_ROUTES;

export const chatBotPostUrl = (apiHost: string, itemId: string): string =>
  `${apiHost}/${buildPostChatBotRoute(itemId)}`;
