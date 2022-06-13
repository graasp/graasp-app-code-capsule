import React, {
  createContext,
  FC,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { Member } from '@graasp/apps-query-client/dist/src/types';
import { List } from 'immutable';
import Loader from '../common/Loader';
import { hooks } from '../../config/queryClient';

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

  console.log(appContext.data?.get('members'));
  return (
    <MembersContext.Provider value={members}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembersContext = (): MembersContextType =>
  React.useContext<MembersContextType>(MembersContext);
