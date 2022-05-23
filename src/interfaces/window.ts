import { Database } from './database';

declare global {
  interface Window {
    appContext: object;
    Cypress: boolean;
    database: Database;
    apiErrors: object;
  }
}

export {};
