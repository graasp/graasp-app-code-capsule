import { List } from 'immutable';

import React, {
  FC,
  ReactElement,
  createContext,
  useEffect,
  useState,
} from 'react';

import { Member } from '@graasp/apps-query-client';

import { hooks } from '../../config/queryClient';
import Loader from '../common/Loader';

export type MembersContextType = List<Member>;

const defaultContextValue = List<Member>();
const MembersContext = createContext<MembersContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const MembersProvider: FC<Prop> = ({ children }) => {
  const appContext = hooks.useAppContext();
  const [members, setMembers] = useState(defaultContextValue);

  useEffect(() => {
    if (
      appContext.data?.get('members') &&
      members !== appContext.data?.get('members')
    ) {
      setMembers(appContext.data.get('members') as List<Member>);
    }
  }, [appContext, members]);

  if (appContext.isLoading) {
    return <Loader />;
  }

  return (
    <MembersContext.Provider value={members}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembersContext = (): MembersContextType =>
  React.useContext<MembersContextType>(MembersContext);
