import { AppData } from '@graasp/apps-query-client';

import { APP_DATA_TYPES } from '../config/appDataTypes';

export type VisibilityVariants = 'member' | 'item';

export interface CommentAppData {
  data: {
    line: number;
    content: string;
    parent: string;
    multiline?: {
      start: number;
      end: number;
    };
  };
  type: APP_DATA_TYPES.COMMENT;
  visibility?: VisibilityVariants;
}
export type CommentType = AppData & CommentAppData;
