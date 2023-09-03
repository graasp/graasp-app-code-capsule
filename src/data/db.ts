import type { Database, LocalContext } from '@graasp/apps-query-client';
import {
  AppDataVisibility,
  CurrentMember,
  DiscriminatedItem,
  MemberType,
  PermissionLevel,
} from '@graasp/sdk';

import { v4 } from 'uuid';

import { APP_DATA_TYPES } from '@/config/appDataTypes';
import { INSTRUCTOR_CODE_ID } from '@/config/constants';
import { API_HOST } from '@/config/env';

import {
  APP_MODE_SETTINGS_NAME,
  AppMode,
  GENERAL_SETTINGS_NAME,
  INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
} from '../config/appSettingsTypes';
import {
  DEFAULT_APP_MODE_SETTINGS,
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS,
} from '../config/settings';

export const mockMember = {
  id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
  name: 'anna',
  email: 'bob@gmail.com',
  extra: {},
  type: MemberType.Individual,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockItemId = '1234-1234-123456-8123-123456';

export const mockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: 'player',
  itemId: mockItemId,
  memberId: mockMember.id,
};

export const mockMembers: CurrentMember[] = [
  {
    id: mockContext.memberId || '',
    name: 'current-member',
    email: '',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: '',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockPythonCode = `import matplotlib.pyplot as plt
import numpy as np

# Data for plotting
t = np.arange(0.0, 2.0, 0.01)
s = 1 + np.sin(2 * np.pi * t)

fig, ax = plt.subplots(figsize=(6,5))
ax.plot(t, s)

ax.set(xlabel='time (s)', ylabel='voltage (mV)',
       title='About as simple as it gets, folks')
ax.grid()

# my sample code in python

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

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: CurrentMember[],
): Database => ({
  appContext: mockContext,
  items: [{ id: mockItemId } as DiscriminatedItem],
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
      memberId: mockMembers[1].id,
      type: APP_DATA_TYPES.COMMENT,
      itemId: mockItemId,
      creatorId: mockMembers[1].id,
      createdAt: new Date(),
      updatedAt: new Date(),
      visibility: AppDataVisibility.Member,
    },
    {
      id: v4(),
      data: {
        line: 3,
        content: '*Hello* this is a _response_ on line 3',
        parent: commentParent,
        codeId: INSTRUCTOR_CODE_ID,
      },
      memberId: mockMembers[0].id,
      type: APP_DATA_TYPES.COMMENT,
      itemId: mockItemId,
      creatorId: mockMembers[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
      visibility: AppDataVisibility.Member,
    },
    {
      id: commentParent,
      data: {
        line: 3,
        content: '*Hello* this is a _comment_ on line 3',
        parent: null,
        codeId: INSTRUCTOR_CODE_ID,
      },
      memberId: mockMembers[0].id,
      type: APP_DATA_TYPES.COMMENT,
      itemId: mockItemId,
      creatorId: mockMembers[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
      visibility: AppDataVisibility.Member,
    },
    {
      id: v4(),
      data: {
        line: 3,
        content: '*A different _thread_* on line 3',
        parent: null,
        codeId: INSTRUCTOR_CODE_ID,
      },
      memberId: mockMembers[0].id,
      type: APP_DATA_TYPES.COMMENT,
      itemId: mockItemId,
      creatorId: mockMembers[1].id,
      createdAt: new Date(Date.now() - 1500),
      updatedAt: new Date(Date.now() - 1500),
      visibility: AppDataVisibility.Member,
    },
  ],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [
    {
      id: v4(),
      name: APP_MODE_SETTINGS_NAME,
      data: { ...DEFAULT_APP_MODE_SETTINGS.toJS(), mode: AppMode.Execute },
      itemId: mockItemId,
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: mockMembers[0].id,
    },
    {
      id: v4(),
      name: INSTRUCTOR_CODE_VERSION_SETTINGS_NAME,
      data: {
        ...DEFAULT_INSTRUCTOR_CODE_VERSION_SETTINGS.toJS(),
        code: mockPythonCode,
        codeId: INSTRUCTOR_CODE_ID,
      },
      itemId: mockItemId,
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: mockMembers[0].id,
    },
    {
      id: v4(),
      name: GENERAL_SETTINGS_NAME,
      data: { ...DEFAULT_GENERAL_SETTINGS.toJS(), showEditButton: true },
      itemId: mockItemId,
      createdAt: new Date(),
      updatedAt: new Date(),
      creatorId: mockMembers[0].id,
    },
    // disable to test data file
    // {
    //   id: 'file-id',
    //   data: {
    //     s3File: {
    //       mimetype: 'text/csv',
    //       name: 'DATA_FILE_SETTING-Book1.csv',
    //       path: 'apps/app-setting/28850284-5593-4b13-bb26-dc1e4411fcfb/7a3a9108-fb6c-49fe-b6fe-742a90ff929c',
    //       size: 74,
    //     },
    //   },
    //   name: 'DATA_FILE_SETTING-Bo',
    //   updatedAt: new Date(),
    //   createdAt: new Date(),
    //   item: mockItem,
    // },
    // {
    //   id: v4(),
    //   data: {
    //     files: [
    //       {
    //         appSettingId: 'file-id',
    //         fileName: 'DATA_FILE_SETTING-Book1.csv',
    //         virtualPath:
    //           'apps/app-setting/28850284-5593-4b13-bb26-dc1e4411fcfb/7a3a9108-fb6c-49fe-b6fe-742a90ff929c',
    //       },
    //     ],
    //   },
    //   name: DATA_FILE_LIST_SETTINGS_NAME,
    //   updatedAt: new Date(),
    //   createdAt: new Date(),
    //   item: mockItem,
    // },
  ],
});

export default buildDatabase;
