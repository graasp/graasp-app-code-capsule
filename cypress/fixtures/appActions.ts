import { AppAction } from '@graasp/apps-query-client';

import { v4 } from 'uuid';

import { APP_ACTIONS_TYPES } from '../../src/config/appActionsTypes';
import { MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

export const MOCK_APP_ACTIONS: AppAction[] = [
  {
    id: v4(),
    data: {
      code: 'test code',
    },
    type: APP_ACTIONS_TYPES.RUN_CODE,
    memberId: MEMBERS.ANNA.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
  },
  {
    id: v4(),
    data: {
      userInput: 'My user input',
    },
    type: APP_ACTIONS_TYPES.SUBMITTED_INPUT,
    memberId: MEMBERS.BOB.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
  },
  {
    id: v4(),
    data: {
      code: 'test code',
    },
    type: APP_ACTIONS_TYPES.SAVE_CODE,
    memberId: MEMBERS.ANNA.id,
    itemId: MOCK_SERVER_ITEM.id,
    createdAt: new Date().toISOString(),
  },
];
