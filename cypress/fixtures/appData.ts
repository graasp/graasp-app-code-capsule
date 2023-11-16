import { AppData, AppDataVisibility, Member } from '@graasp/sdk';

import { v4 as uuid } from 'uuid';

import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { INSTRUCTOR_CODE_ID } from '../../src/config/constants';
import { PYTHON } from '../../src/config/programmingLanguages';
import { CodeType } from '../../src/interfaces/codeVersions';
import { CommentAppData } from '../../src/interfaces/comment';
import { LiveCodeType } from '../../src/interfaces/liveCode';
import { MOCK_CHATBOT_PROMPT_SETTINGS_INPUT } from './appSettings';
import { CURRENT_MEMBER, MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

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
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date('2020-01-01').toISOString(),
    updatedAt: new Date('2020-01-01').toISOString(),
    type: APP_DATA_TYPES.COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: uuid(),
    data: {
      line: 3,
      codeId: INSTRUCTOR_CODE_ID,
      content: 'Other Thread start\n\nComment on line 3\n\nFrom Bob',
      parent: null,
    },
    member: MEMBERS.BOB,
    creator: MEMBERS.BOB,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: uuid(),
    data: {
      line: 4,
      codeId: INSTRUCTOR_CODE_ID,
      content: 'Other Thread start\n\nComment on line 3\n\nFrom Anna',
      parent: null,
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
    visibility: AppDataVisibility.Member,
  },
];

export const MOCK_ORPHAN_COMMENT: AppData & CommentAppData = {
  id: uuid(),
  data: {
    line: 1,
    codeId: INSTRUCTOR_CODE_ID,
    content: 'Orphan comment',
    parent: '123456789',
  },
  member: MEMBERS.BOB,
  creator: MEMBERS.BOB,
  item: MOCK_SERVER_ITEM,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  type: APP_DATA_TYPES.COMMENT,
  visibility: AppDataVisibility.Member,
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
    member: MEMBERS.BOB,
    creator: MEMBERS.BOB,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: uuid(),
    data: { text: 'some text' },
    member: MEMBERS.BOB,
    creator: MEMBERS.BOB,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: uuid(),
    data: { text: 'some text' },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
    visibility: AppDataVisibility.Member,
  },
  // teacher comments
  {
    id: uuid(),
    data: { text: 'some text' },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.TEACHER_COMMENT,
    visibility: AppDataVisibility.Member,
  },
];

export const generateSingleLineThread = (
  lineIndex: number,
  threadLength = 1,
  creator: Member = CURRENT_MEMBER,
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
      item: MOCK_SERVER_ITEM,
      member: creator,
      creator,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: APP_DATA_TYPES.COMMENT,
      visibility: AppDataVisibility.Member,
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

export const MOCK_COMMIT_MESSAGE = 'My commit message';
export const MOCK_COMMIT_DESCRIPTION = 'Full description\nOn multiple lines';

export const MOCK_CODE_APP_DATA_BOB_PY: LiveCodeType = {
  id: uuid(),
  item: MOCK_SERVER_ITEM,
  type: APP_DATA_TYPES.LIVE_CODE,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  creator: MEMBERS.BOB,
  member: MEMBERS.BOB,
  data: {
    code: 'sample code from bob',
  },
  visibility: AppDataVisibility.Member,
};

export const MOCK_CODE_APP_DATA_OLD_BOB_PY: LiveCodeType = {
  id: uuid(),
  item: MOCK_SERVER_ITEM,
  type: APP_DATA_TYPES.LIVE_CODE,
  createdAt: new Date('2020-06-02').toISOString(),
  updatedAt: new Date('2020-06-02').toISOString(),
  creator: MEMBERS.BOB,
  member: MEMBERS.BOB,
  data: {
    code: 'sample code from bob 2',
  },
  visibility: AppDataVisibility.Member,
};

export const MOCK_CODE_VERSIONS: CodeType[] = [
  {
    id: uuid(),
    item: MOCK_SERVER_ITEM,
    type: APP_DATA_TYPES.CODE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creator: MEMBERS.ANNA,
    member: MEMBERS.ANNA,
    data: {
      code: 'sample code from Anna',
      language: PYTHON,
      commitMessage: 'Anna 1',
      commitDescription: 'Long Anna 1',
    },
    visibility: AppDataVisibility.Member,
  },

  {
    id: uuid(),
    item: MOCK_SERVER_ITEM,
    type: APP_DATA_TYPES.CODE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    creator: MEMBERS.ANNA,
    member: MEMBERS.ANNA,
    visibility: AppDataVisibility.Member,
    data: {
      code: 'sample code from Anna 2',
      language: PYTHON,
      commitMessage: 'Anna 2',
      commitDescription: 'Long Anna 2',
    },
  },
];

export const DEFAULT_OPEN_AI_RESPONSE = 'Biip boop i am a bot';

const threadIds = Array.from({ length: 5 }, () => uuid());

export const CHATBOT_THREAD_MOCK_COMMENTS: AppData[] = [
  // chatbot thread
  {
    id: threadIds[0],
    data: {
      line: 1,
      codeId: INSTRUCTOR_CODE_ID,
      content: MOCK_CHATBOT_PROMPT_SETTINGS_INPUT.data.chatbotPrompt,
      parent: null,
      chatbotPromptSettingId: MOCK_CHATBOT_PROMPT_SETTINGS_INPUT.id,
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date('2020-01-01').toISOString(),
    updatedAt: new Date('2020-01-01').toISOString(),
    type: APP_DATA_TYPES.BOT_COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: threadIds[1],
    data: {
      line: 1,
      codeId: INSTRUCTOR_CODE_ID,
      content: 'User response to chatbot prompt',
      parent: threadIds[0],
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.COMMENT,
    visibility: AppDataVisibility.Member,
  },
  {
    id: threadIds[2],
    data: {
      line: 1,
      codeId: INSTRUCTOR_CODE_ID,
      content: 'Bipbooop',
      parent: threadIds[1],
    },
    member: CURRENT_MEMBER,
    creator: CURRENT_MEMBER,
    item: MOCK_SERVER_ITEM,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: APP_DATA_TYPES.BOT_COMMENT,
    visibility: AppDataVisibility.Member,
  },
];
