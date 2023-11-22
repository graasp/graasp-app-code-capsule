import type { AppData, Member, UUID } from '@graasp/sdk';

import { ProgrammingLanguagesType } from '@/config/programmingLanguages';

import { APP_DATA_TYPES } from '../config/appDataTypes';

export type CodeVersionType = {
  code: string;
  language: ProgrammingLanguagesType;
  commitMessage: string;
  commitDescription: string;
};

export type CodeVersionSelectType = {
  id: UUID;
  data: CodeVersionType;
  creator: Member;
  updatedAt: string;
};

export interface CodeAppData {
  data: CodeVersionType;
  type: APP_DATA_TYPES.CODE;
}

// stripped out version of a code Resource but without the AppData properties like id, creator ...
export type CodeType = { data: CodeVersionType } & AppData;
