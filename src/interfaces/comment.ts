import type { AppData } from '@graasp/sdk';
import { ImmutableCast } from '@graasp/sdk/frontend';

export type CommentAppData = {
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

export type CommentType = AppData<CommentAppData>;

export type CommentTypeRecord = ImmutableCast<CommentType>;
