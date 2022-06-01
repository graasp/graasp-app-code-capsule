import { v4 } from 'uuid';
import { Member } from '@graasp/apps-query-client/dist/src/types';
import { AppContext } from '../interfaces/appContext';
import { Database } from '../interfaces/database';
import { GENERAL_SETTINGS_KEY } from '../config/appSettings';
import { DEFAULT_GENERAL_SETTINGS } from '../interfaces/settings';
import { APP_DATA_TYPES } from '../config/appDataTypes';

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

const mockPythonCode = `# my sample code in python

age = input('What is your age ?')
print(f'Your age is {age}')

# ask another question
print('wait a bit')
''' and here starts a
multiline comment 
that continues here also
'''
for i in range(10000):
    pass

print('Done!')
print('See you !')
`;

const commentParent = v4();

const buildDatabase = (appContext: Partial<AppContext>): Database => ({
  appData: [
    {
      id: v4(),
      data: {
        line: 1,
        content: 'Hello this is a comment on line 1',
        parent: null,
      },
      memberId: 'mock-member-id-2',
      type: APP_DATA_TYPES.COMMENT,
      itemId: appContext.itemId || '',
      creator: 'mock-member-id-2',
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    },
    {
      id: v4(),
      data: {
        line: 3,
        content: '*Hello* this is a _response_ on line 3',
        parent: commentParent,
      },
      memberId: 'mock-member-id',
      type: APP_DATA_TYPES.COMMENT,
      itemId: appContext.itemId || '',
      creator: 'mock-member-id',
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    },
    {
      id: commentParent,
      data: {
        line: 3,
        content: '*Hello* this is a _comment_ on line 3',
        parent: null,
      },
      memberId: 'mock-member-id',
      type: APP_DATA_TYPES.COMMENT,
      itemId: appContext.itemId || '',
      creator: 'mock-member-id',
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString(),
    },
  ],
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
      data: { ...DEFAULT_GENERAL_SETTINGS, code: mockPythonCode },
      itemId: appContext.itemId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
});

export default buildDatabase;
