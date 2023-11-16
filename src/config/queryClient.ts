import { configureQueryClient } from '@graasp/apps-query-client';

import { API_HOST, GRAASP_APP_KEY, MOCK_API } from './env';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  mutations,
} = configureQueryClient({
  notifier: (data) => {
    // eslint-disable-next-line no-console
    console.log('notifier: ', data);
  },
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY,
  API_HOST,
  enableWebsocket: false,
  isStandalone: MOCK_API,
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  mutations,
};
