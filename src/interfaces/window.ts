import { LocalContext } from '@graasp/apps-query-client/dist/src/types';
import { Database } from './database';

declare global {
  interface Window {
    appContext: LocalContext;
    Cypress: boolean;
    database: Database;
    apiErrors: object;
  }
}

export {};
