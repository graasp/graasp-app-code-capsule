import { v4 } from 'uuid';
import { APP_DATA_TYPES } from '../../src/config/appDataTypes';
import { CURRENT_MEMBER, MEMBERS } from './members';

export const MOCK_SERVER_ITEM = { id: '1234567890' };

export const MOCK_SERVER_API_HOST = 'http://localhost:3636';

export const MOCK_APP_DATA = [
  // comments
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date('2020-01-01'),
    type: APP_DATA_TYPES.COMMENT,
  },
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: MEMBERS.BOB.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: Date.now(),
    type: APP_DATA_TYPES.COMMENT,
  },
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: MEMBERS.BOB.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: Date.now(),
    type: APP_DATA_TYPES.COMMENT,
  },
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: MEMBERS.BOB.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: Date.now(),
    type: APP_DATA_TYPES.COMMENT,
  },
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: Date.now(),
    type: APP_DATA_TYPES.COMMENT,
  },
  // teacher comments
  {
    id: v4(),
    data: { text: 'some text' },
    memberId: CURRENT_MEMBER.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: Date.now(),
    type: APP_DATA_TYPES.TEACHER_COMMENT,
  },
];
