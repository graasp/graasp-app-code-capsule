import qs from 'qs';
import React, { createContext, FC, ReactElement } from 'react';
import { hooks } from '../../config/queryClient';
import Loader from '../common/Loader';

const defaultContextValue = '';
const TokenContext = createContext<string>(defaultContextValue);

type Prop = {
  children: ReactElement;
};

export const TokenProvider: FC<Prop> = ({ children }) => {
  const { itemId }: { itemId?: string } = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  });
  let contextValue = defaultContextValue;
  if (itemId) {
    const { data, isLoading, isError } = hooks.useAuthToken(itemId);

    if (isLoading) {
      return <Loader />;
    }

    if (isError) {
      console.error('An error occured while requesting the token.');
    }

    contextValue = (data as string) || defaultContextValue;
  }
  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = (): string =>
  React.useContext<string>(TokenContext);
