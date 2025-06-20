import React from 'react';
import ReactDOM from 'react-dom/client';

import { MockSolution, mockApi } from '@graasp/apps-query-client';

import * as Sentry from '@sentry/react';

import { MOCK_API } from './config/env';
import { generateSentryConfig } from './config/sentry';
import buildDatabase, { mockContext, mockMembers } from './data/db';
import './index.css';
import Root from './modules/main/Root';

Sentry.init({
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  ...generateSentryConfig(),
});

// setup mocked api for cypress or standalone app
/* istanbul ignore next */
if (MOCK_API) {
  mockApi(
    {
      externalUrls: [],
      dbName: 'graasp-app-code-capsule-mocks',
      appContext: window.Cypress ? window.appContext : mockContext,
      database: window.Cypress ? window.database : buildDatabase(mockMembers),
    },
    window.Cypress ? MockSolution.MirageJS : MockSolution.ServiceWorker,
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
