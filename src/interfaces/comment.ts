import { AppData } from '@graasp/apps-query-client/dist/src/types';

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
}
export type CommentType = AppData & CommentAppData;

export type VisibilityVariants = 'member' | 'item';
