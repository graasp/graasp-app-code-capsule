import { v4 as uuid } from 'uuid';

import { AppData } from '@graasp/apps-query-client';

import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { GENERAL_SETTINGS_KEY } from '../../src/config/appSettingsTypes';
import { INSTRUCTOR_CODE_ID } from '../../src/config/constants';
import { DEFAULT_GENERAL_SETTINGS } from '../../src/config/settings';
import { MOCK_CODE_SAMPLE } from './appSettings';
import { CURRENT_MEMBER, MEMBERS } from './members';

export const MOCK_SERVER_ITEM = { id: '1234567890' };

export const MOCK_SERVER_API_HOST = 'http://localhost:3636';

export const SINGLE_LINE_MOCK_COMMENTS: AppData[] = [
  // comments
  {
    id: uuid(),
    data: {
      line: 1,
      codeId: INSTRUCTOR_CODE_ID,
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
    id: uuid(),
    data: {
      line: 3,
      codeId: INSTRUCTOR_CODE_ID,
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
  {
    id: uuid(),
    data: {
      line: 4,
      codeId: INSTRUCTOR_CODE_ID,
      content: 'Other Thread start\n\nComment on line 3\n\nFrom Anna',
      parent: null,
    },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
  },
];

export const MOCK_ORPHAN_COMMENT = {
  id: uuid(),
  data: {
    line: 1,
    codeId: INSTRUCTOR_CODE_ID,
    content: 'Orphan comment',
    parent: '123456789',
  },
  memberId: MEMBERS.BOB.id,
  creator: MEMBERS.BOB.id,
  itemId: MOCK_SERVER_ITEM.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  type: APP_DATA_TYPES.COMMENT,
};

export const MULTILINE_MOCK_COMMENTS: AppData[] = [
  {
    id: uuid(),
    data: {
      line: 3,
      codeId: INSTRUCTOR_CODE_ID,
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
    id: uuid(),
    data: { text: 'some text' },
    memberId: MEMBERS.BOB.id,
    creator: MEMBERS.BOB.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
  },
  {
    id: uuid(),
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
    id: uuid(),
    data: { text: 'some text' },
    memberId: CURRENT_MEMBER.id,
    creator: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.TEACHER_COMMENT,
  },
];

export const generateSingleLineThread = (
  lineIndex: number,
  threadLength = 1,
  creator: string = CURRENT_MEMBER.id,
): AppData[] => {
  let parentId = null;
  const thread: AppData[] = [];
  for (let idx = 0; idx < threadLength; idx += 1) {
    thread.push({
      id: uuid(),
      data: {
        line: lineIndex,
        codeId: INSTRUCTOR_CODE_ID,
        content: `Thread content ${idx + 1}`,
        parent: parentId,
      },
      itemId: MOCK_SERVER_ITEM.id,
      memberId: creator,
      creator,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: APP_DATA_TYPES.COMMENT,
    });
    parentId = thread.at(-1)?.id;
  }
  return thread;
};

export const generateSingleLineCommentThread = (
  options: { lineIndex: number; threadLength: number }[],
): AppData[] =>
  options
    .map((t) => generateSingleLineThread(t.lineIndex, t.threadLength))
    .reduce((acc: AppData[], arr) => acc.concat(arr), []);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_APP_SETTINGS = [
  {
    id: uuid(),
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

export const MOCK_COMMIT_MESSAGE = 'My commit message';
export const MOCK_COMMIT_DESCRIPTION = 'Full description\nOn multiple lines';
