import { toast } from 'react-toastify';

import { Notifier, configureQueryClient } from '@graasp/apps-query-client';

import type { AxiosError } from 'axios';

import { InfoToast, NetworkErrorToast } from '@/modules/common/CustomToasts';

import {
  API_HOST,
  ENABLE_SUCCESS_TOASTS,
  GRAASP_APP_KEY,
  MOCK_API,
} from './env';

const notifier: Notifier = (data) => {
  const { payload } = data;
  if (payload) {
    // eslint-disable-next-line no-console
    console.log(data.payload);
    // axios error
    if (
      payload.error &&
      payload.error.name === 'AxiosError' &&
      (payload.error as AxiosError).response
    ) {
      const { message } = (payload.error as AxiosError).response?.data as {
        message: string;
      };
      toast.error(
        <NetworkErrorToast
          title={payload.error.message}
          description={message}
        />,
      );
    }
    if (ENABLE_SUCCESS_TOASTS === true) {
      toast.success(<InfoToast type={data.type} payload={payload} />);
    }
  }
};

const {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  mutations,
} = configureQueryClient({
  notifier,
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
