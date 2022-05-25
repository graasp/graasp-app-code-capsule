import { v4 } from 'uuid';
import { Data, Member } from '@graasp/apps-query-client/dist/src/types';
import { AppContext } from '../interfaces/appContext';
import { Database } from '../interfaces/database';
import { GENERAL_SETTINGS_KEY } from '../config/appSettings';
import { DEFAULT_GENERAL_SETTINGS } from '../interfaces/settings';

export const mockContext = {
  permission: 'admin',
  context: 'builder',
  itemId: '1234-1234-123456-8123-123456',
  memberId: 'mock-member-id',
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId,
    name: 'mock-member',
    email: '',
    extra: {},
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: '',
    extra: {},
  },
];

const buildDatabase = (appContext: Partial<AppContext>): Database => ({
  appData: [],
  appActions: [],
  members: [
    ...mockMembers,
    // in case there is no members defined, we spread an empty array
    ...(appContext.members ?? []),
  ],
  appSettings: [
    {
      id: v4(),
      name: GENERAL_SETTINGS_KEY,
      data: DEFAULT_GENERAL_SETTINGS as unknown as Data,
      itemId: appContext.itemId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
});

export default buildDatabase;
