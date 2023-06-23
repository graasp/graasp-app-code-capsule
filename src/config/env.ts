const {
  VITE_GRAASP_APP_KEY,
  VITE_VERSION,
  VITE_SENTRY_ENV,
  VITE_GA_MEASUREMENT_ID,
  VITE_MOCK_API,
  VITE_API_HOST,
  VITE_OPEN_AI_API_URL,
} = window.Cypress ? Cypress.env() : import.meta.env;

export const MOCK_API = VITE_MOCK_API === 'true';
export const GA_MEASUREMENT_ID = VITE_GA_MEASUREMENT_ID;
export const API_HOST = VITE_API_HOST;
export const VERSION = VITE_VERSION || 'latest';
export const GRAASP_APP_KEY = VITE_GRAASP_APP_KEY;
export const OPEN_AI_API_URL = VITE_OPEN_AI_API_URL || 'invalidURL';
export const SENTRY_ENV = VITE_SENTRY_ENV;
