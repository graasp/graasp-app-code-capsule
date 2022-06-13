import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { mockApi } from '@graasp/apps-query-client';
import { BrowserTracing } from '@sentry/tracing';
import * as Sentry from '@sentry/react';
import Root from './components/Root';
import { MOCK_API } from './config/settings';
import buildDatabase, { mockContext } from './data/db';
import { generateSentryConfig } from './config/sentry';

Sentry.init({
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  ...generateSentryConfig(),
});

// setup mocked api for cypress or standalone app
if (MOCK_API) {
  mockApi({
    appContext: window.Cypress ? window.appContext : mockContext,
    database: window.Cypress ? window.database : buildDatabase(mockContext),
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
