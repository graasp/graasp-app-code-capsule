import React, { createContext, FC, ReactElement } from 'react';
import { Member } from '@graasp/apps-query-client/dist/src/types';
import { List } from 'immutable';
import { useAppContext } from './hooks';
import Loader from '../common/Loader';

export type MembersContextType = Member[];

const defaultContextValue: Member[] = [];
const MembersContext = createContext<MembersContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const MembersProvider: FC<Prop> = ({ children }) => {
  const appContext = useAppContext();

  if (appContext.isLoading) {
    return <Loader />;
  }

  const members: Member[] =
    (appContext.data?.get('members') as Member[]) ?? List<Member>();

  return (
    <MembersContext.Provider value={members}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembersContext = (): MembersContextType =>
  React.useContext<MembersContextType>(MembersContext);
