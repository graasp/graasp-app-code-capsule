import { v4 } from 'uuid';
import { AppData } from '@graasp/apps-query-client/dist/src/types';
import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { CURRENT_MEMBER, MEMBERS } from './members';
import { GENERAL_SETTINGS_KEY } from '../../src/config/appSettingsTypes';
import { MOCK_CODE_SAMPLE } from './appSettings';
import { DEFAULT_GENERAL_SETTINGS } from '../../src/config/settings';

export const MOCK_SERVER_ITEM = { id: '1234567890' };

export const MOCK_SERVER_API_HOST = 'http://localhost:3636';

export const SINGLE_LINE_MOCK_COMMENTS: AppData[] = [
  // comments
  {
    id: v4(),
    data: {
      line: 1,
      content: 'Thread start\n\nComment on line 1',
      parent: null,
    },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date('2020-01-01').toISOString(),
    updatedAt: new Date('2020-01-01').toISOString(),
    type: APP_DATA_TYPES.COMMENT,
  },
  {
    id: v4(),
    data: {
      line: 3,
      content: 'Other Thread start\n\nComment on line 3\n\nFrom Bob',
      parent: null,
    },
    memberId: MEMBERS.BOB.id,
    creator: MEMBERS.BOB.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
  },
];

export const MULTILINE_MOCK_COMMENTS: AppData[] = [
  {
    id: v4(),
    data: {
      line: 3,
      multiline: {
        start: 1,
        end: 3,
      },
      content:
        'Multiline Thread start\n\nComment from line 1 to line 3\n\nFrom Bob',
      parent: null,
    },
    memberId: MEMBERS.BOB.id,
    creator: MEMBERS.BOB.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
  },
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: MEMBERS.BOB.id,
    creator: MEMBERS.BOB.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
  },
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
  },
  // teacher comments
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.TEACHER_COMMENT,
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_APP_SETTINGS = [
  {
    id: v4(),
    name: GENERAL_SETTINGS_KEY,
    data: {
      ...DEFAULT_GENERAL_SETTINGS,
      code: MOCK_CODE_SAMPLE,
    },
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
