import { v4 } from 'uuid';
import type {
  LocalContext,
  Member,
} from '@graasp/apps-query-client/dist/src/types';
import { AppContext } from '../interfaces/appContext';
import { Database } from '../interfaces/database';
import { GENERAL_SETTINGS_KEY } from '../config/appSettingsTypes';
import { APP_DATA_TYPES } from '../config/appDataTypes';
import { REACT_APP_API_HOST } from '../config/env';
import { DEFAULT_GENERAL_SETTINGS } from '../config/settings';

export const mockContext: LocalContext = {
  apiHost: REACT_APP_API_HOST,
  permission: 'admin',
  context: 'player',
  itemId: '1234-1234-123456-8123-123456',
  memberId: 'mock-member-id',
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId || '',
    name: 'current-member',
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
        content: `Hello this is a \`comment\` on line 1
\`\`\`python
import pandas as pd
print('Hello World')
\`\`\`
And some more text here

- bullet 1
  - sub-bullet 1
  - sub-bullet 2
- bullet 2

And some text to **finish** _off_`,
        parent: null,
      },
      memberId: 'mock-member-id-2',
      type: APP_DATA_TYPES.COMMENT,
      itemId: appContext.itemId || '',
      creator: 'mock-member-id-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: v4(),
      data: {
        line: 3,
        content: '*A different _thread_* on line 3',
        parent: null,
      },
      memberId: 'mock-member-id-2',
      type: APP_DATA_TYPES.COMMENT,
      itemId: appContext.itemId || '',
      creator: 'mock-member-id-2',
      createdAt: new Date(Date.now() - 1500).toISOString(),
      updatedAt: new Date(Date.now() - 1500).toISOString(),
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
