import React, { createContext, FC, PropsWithChildren, useMemo } from 'react';
import { AppData } from '@graasp/apps-query-client/dist/src/types';
import Immutable from 'immutable';
import Loader from '../common/Loader';
import { hooks, MUTATION_KEYS, useMutation } from '../../config/queryClient';
import { VisibilityVariants } from '../../interfaces/comment';

type PostAppDataType = {
  data: { [key: string]: unknown };
  type: string;
  visibility?: VisibilityVariants;
};

type PatchAppDataType = {
  data: { [key: string]: unknown };
  id: string;
};

type DeleteAppDataType = {
  id: string;
};

export type AppDataContextType = {
  postAppData: (payload: PostAppDataType) => void;
  patchAppData: (payload: PatchAppDataType) => void;
  deleteAppData: (payload: DeleteAppDataType) => void;
  appData: Immutable.List<AppData>;
};

const defaultContextValue = {
  postAppData: () => null,
  patchAppData: () => null,
  deleteAppData: () => null,
  appData: Immutable.List<AppData>(),
};

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

// eslint-disable-next-line @typescript-eslint/ban-types
type Prop = {};

export const AppDataProvider: FC<PropsWithChildren<Prop>> = ({ children }) => {
  const appData = hooks.useAppData();
  const postAppData = useMutation<unknown, unknown, PostAppDataType>(
    MUTATION_KEYS.POST_APP_DATA,
  );
  const patchAppData = useMutation<unknown, unknown, PatchAppDataType>(
    MUTATION_KEYS.PATCH_APP_DATA,
  );
  const deleteAppData = useMutation<unknown, unknown, DeleteAppDataType>(
    MUTATION_KEYS.DELETE_APP_DATA,
  );

  const contextValue = useMemo(
    () => ({
      postAppData: postAppData.mutate,
      patchAppData: patchAppData.mutate,
      deleteAppData: deleteAppData.mutate,
      appData: appData.data || Immutable.List<AppData>(),
    }),
    [appData, deleteAppData, patchAppData, postAppData],
  );

  if (appData.isLoading) {
    return <Loader />;
  }

  return (
    <AppDataContext.Provider value={contextValue}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataContext = (): AppDataContextType =>
  React.useContext<AppDataContextType>(AppDataContext);
