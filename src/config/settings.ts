import { REACT_APP_MOCK_API } from './env';

export const MOCK_API = REACT_APP_MOCK_API === 'true';

export const CONTEXTS = {
  BUILDER: 'builder',
  PLAYER: 'player',
  ANALYZER: 'analyzer',
  STANDALONE: 'standalone',
};

export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin',
};

export const DEFAULT_CONTEXT = CONTEXTS.BUILDER;
export const DEFAULT_PERMISSION = PERMISSIONS.READ;

export const DEFAULT_CONTEXT_API_HOST = '';
export const DEFAULT_CONTEXT_ITEM_ID = '';
export const DEFAULT_CONTEXT_LANGUAGE = 'en';
export const DEFAULT_CONTEXT_STANDALONE = false;
export const DEFAULT_CONTEXT_OFFLINE = false;
export const DEFAULT_CONTEXT_DEV = false;
export const DEFAULT_CONTEXT_SETTINGS = {};
