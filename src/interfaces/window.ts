import { Database } from './database';
import { AppContext } from './appContext';

declare global {
  interface Window {
    appContext: Partial<AppContext>;
    Cypress: boolean;
    database: Database;
    apiErrors: object;
  }
}

export {};
