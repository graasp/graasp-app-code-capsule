import { AppData } from '@graasp/apps-query-client/dist/src/types';

export interface CommentAppData {
  data: {
    line: number;
    content: string;
    parent: string;
  };
}
export type CommentType = AppData & CommentAppData;
