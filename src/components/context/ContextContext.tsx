import React, { createContext, FC, ReactElement } from 'react';
import { Map } from 'immutable';
import { getitemIdFromQueryString } from '../../utils/urls';
import {
  DEFAULT_CONTEXT,
  DEFAULT_CONTEXT_API_HOST,
  DEFAULT_CONTEXT_DEV,
  DEFAULT_CONTEXT_ITEM_ID,
  DEFAULT_CONTEXT_LANGUAGE,
  DEFAULT_CONTEXT_OFFLINE,
  DEFAULT_CONTEXT_SETTINGS,
  DEFAULT_CONTEXT_STANDALONE,
  DEFAULT_PERMISSION,
} from '../../config/settings';
import { hooks } from '../../config/queryClient';
import Loader from '../common/Loader';
import { AppContext } from '../../interfaces/appContext';

const defaultContextValue: Partial<AppContext> = {
  apiHost: DEFAULT_CONTEXT_API_HOST,
  context: DEFAULT_CONTEXT,
  permission: DEFAULT_PERMISSION,
  itemId: DEFAULT_CONTEXT_ITEM_ID,
  lang: DEFAULT_CONTEXT_LANGUAGE,
  offline: DEFAULT_CONTEXT_OFFLINE,
  dev: DEFAULT_CONTEXT_DEV,
  standalone: DEFAULT_CONTEXT_STANDALONE,
  settings: DEFAULT_CONTEXT_SETTINGS,
};

const Context = createContext(defaultContextValue);

type Props = {
  children: ReactElement;
};

export const ContextProvider: FC<Props> = ({ children }) => {
  const itemId = getitemIdFromQueryString();

  let contextValue = defaultContextValue;
  if (itemId) {
    const {
      data: context,
      isLoading,
      isError,
    } = hooks.useGetLocalContext(itemId);

    if (isLoading) {
      return <Loader />;
    }
    if (isError) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while fetching the local context');
    }
    if (Map.isMap(context)) {
      contextValue = context?.toJS() as Partial<AppContext>;
    }
  }

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useContextContext = (): Partial<AppContext> =>
  React.useContext<Partial<AppContext>>(Context);
