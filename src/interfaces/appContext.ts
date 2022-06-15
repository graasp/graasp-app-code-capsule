import { Member } from '@graasp/apps-query-client';

export interface AppContext {
  id: string;
  members: Member[];

  apiHost: string;
  context: string;
  permission: string;
  itemId: string;
  memberId: string;
  lang: string;
  offline: string | boolean;
  dev: string | boolean;
  standalone: boolean;
  settings: unknown;
}
