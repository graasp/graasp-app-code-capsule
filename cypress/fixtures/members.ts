import { AccountType, CompleteMember } from '@graasp/sdk';

export const MEMBERS: { [key: string]: CompleteMember } = {
  ANNA: {
    id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'anna',
    email: 'anna@gmail.com',
    extra: {},
    type: AccountType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enableSaveActions: true,
    isValidated: true,
  },
  BOB: {
    id: '1f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'bob',
    email: 'bob@gmail.com',
    extra: {},
    type: AccountType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    enableSaveActions: true,
    isValidated: true,
  },
};

export const CURRENT_MEMBER = MEMBERS.ANNA;
