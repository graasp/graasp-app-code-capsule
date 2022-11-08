import Immutable, { List } from 'immutable';

import React, { FC, PropsWithChildren, createContext, useMemo } from 'react';

import { APP_DATA_TYPES } from '../../config/appDataTypes';
import { GENERAL_SETTINGS_NAME } from '../../config/appSettingsTypes';
import {
  REVIEW_MODE_INDIVIDUAL,
  VISIBILITY_ITEM,
  VISIBILITY_MEMBER,
} from '../../config/constants';
import { MUTATION_KEYS, hooks, useMutation } from '../../config/queryClient';
import { DEFAULT_GENERAL_SETTINGS } from '../../config/settings';
import { CodeType } from '../../interfaces/codeVersions';
import { CommentType, VisibilityVariants } from '../../interfaces/comment';
import { LiveCodeType } from '../../interfaces/liveCode';
import { SETTINGS_KEYS } from '../../interfaces/settings';
import Loader from '../common/Loader';
import { useSettings } from './SettingsContext';

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
  codeAppData: Immutable.List<CodeType>;
  comments: Immutable.List<CommentType>;
  liveCode: Immutable.List<LiveCodeType>;
};

const defaultContextValue = {
  postAppData: () => null,
  patchAppData: () => null,
  deleteAppData: () => null,
  codeAppData: Immutable.List<CodeType>(),
  comments: Immutable.List<CommentType>(),
  liveCode: Immutable.List<LiveCodeType>(),
};

const AppDataContext = createContext<AppDataContextType>(defaultContextValue);

// eslint-disable-next-line @typescript-eslint/ban-types
type Prop = {
  currentUserId?: string;
};

export const AppDataProvider: FC<PropsWithChildren<Prop>> = ({
  currentUserId,
  children,
}) => {
  const appData = hooks.useAppData();
  const { [GENERAL_SETTINGS_NAME]: settings = DEFAULT_GENERAL_SETTINGS } =
    useSettings();
  // set the default visibility following the review mode
  const visibilityVariant =
    settings[SETTINGS_KEYS.REVIEW_MODE] === REVIEW_MODE_INDIVIDUAL
      ? VISIBILITY_MEMBER
      : VISIBILITY_ITEM;
  const { mutate: postAppData } = useMutation<
    unknown,
    unknown,
    PostAppDataType
  >(MUTATION_KEYS.POST_APP_DATA);
  const { mutate: patchAppData } = useMutation<
    unknown,
    unknown,
    PatchAppDataType
  >(MUTATION_KEYS.PATCH_APP_DATA);
  const { mutate: deleteAppData } = useMutation<
    unknown,
    unknown,
    DeleteAppDataType
  >(MUTATION_KEYS.DELETE_APP_DATA);

  const contextValue = useMemo(() => {
    const filteredAppData = currentUserId
      ? appData.data?.filter((res) => res.creator === currentUserId)
      : appData.data;
    const comments = filteredAppData?.filter(
      (res) => res.type === APP_DATA_TYPES.COMMENT,
    ) as List<CommentType>;
    const codeAppData = filteredAppData?.filter(
      (res) => res.type === APP_DATA_TYPES.CODE,
    ) as List<CodeType>;
    const liveCode = filteredAppData?.filter(
      (res) => res.type === APP_DATA_TYPES.LIVE_CODE,
    ) as List<LiveCodeType>;
    return {
      postAppData: (payload: PostAppDataType) => {
        postAppData({ visibility: visibilityVariant, ...payload });
      },
      patchAppData,
      deleteAppData,
      codeAppData,
      comments,
      liveCode,
    };
  }, [
    appData.data,
    currentUserId,
    deleteAppData,
    patchAppData,
    postAppData,
    visibilityVariant,
  ]);

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
