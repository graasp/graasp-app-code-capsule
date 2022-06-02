import React, { createContext, FC, ReactElement, useMemo } from 'react';
import { AppData } from '@graasp/apps-query-client/dist/src/types';
import { List } from 'immutable';
import { useAppData } from './hooks';
import Loader from '../common/Loader';
import { MUTATION_KEYS, useMutation } from '../../config/queryClient';
import { CommentType } from '../../interfaces/comment';
import { APP_DATA_TYPES } from '../../config/appDataTypes';

type PostAppDataType = {
  data: { [key: string]: unknown };
  type: string;
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
  appData: List<AppData>;
  comments: List<CommentType>;
};

const defaultContextValue = {
  postAppData: () => null,
  patchAppData: () => null,
  deleteAppData: () => null,
  appData: List<AppData>(),
  comments: List<CommentType>(),
};

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const AppDataProvider: FC<Prop> = ({ children }) => {
  const appData = useAppData();
  const postAppData = useMutation<unknown, unknown, PostAppDataType>(
    MUTATION_KEYS.POST_APP_DATA,
  );
  const patchAppData = useMutation<unknown, unknown, PatchAppDataType>(
    MUTATION_KEYS.PATCH_APP_DATA,
  );
  const deleteAppData = useMutation<unknown, unknown, DeleteAppDataType>(
    MUTATION_KEYS.DELETE_APP_DATA,
  );

  const appDataData = (appData.data as List<AppData>) ?? List<AppData>();
  const comments = appDataData?.filter(
    (c) => c.type === APP_DATA_TYPES.COMMENT,
  ) as List<CommentType>;

  const contextValue = useMemo(
    () => ({
      postAppData: postAppData.mutate,
      patchAppData: patchAppData.mutate,
      deleteAppData: deleteAppData.mutate,
      appData: appDataData,
      comments,
    }),
    [appDataData, comments, deleteAppData, patchAppData, postAppData],
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
