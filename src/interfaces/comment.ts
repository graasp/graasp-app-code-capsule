import type { AppData } from '@graasp/sdk';
import { ImmutableCast } from '@graasp/sdk/frontend';

import { APP_DATA_TYPES } from '../config/appDataTypes';

export type CommentAppData = {
  data: {
    line: number;
    codeId: string;
    content: string;
    parent: string;
    multiline?: {
      start: number;
      end: number;
    };
    chatbotPromptSettingId?: string;
  };
  type: APP_DATA_TYPES.COMMENT | APP_DATA_TYPES.BOT_COMMENT;
};

export type CommentType = AppData & CommentAppData;

export type CommentTypeRecord = ImmutableCast<CommentType>;
