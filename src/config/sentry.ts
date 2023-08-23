import { SENTRY_DSN, SENTRY_ENV, VERSION } from './env';

type SentryConfigType = {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  release: string;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
};

export const generateSentryConfig = (): SentryConfigType => ({
  // dsn is set only when not running inside cypress
  dsn: (!window.Cypress && SENTRY_DSN) || '',
  environment: SENTRY_ENV,
  tracesSampleRate: import.meta.env.PROD ? 0.3 : 0.0,
  // release is set only when building for production
  release: VERSION,

  replaysSessionSampleRate: import.meta.env.PROD ? 1.0 : 0.0,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
});
