import React from 'react';
import ReactDOM from 'react-dom/client';

import { mockApi } from '@graasp/apps-query-client';

import { BrowserTracing, Replay } from '@sentry/browser';
import * as Sentry from '@sentry/react';

import { MOCK_API, OPEN_AI_API_URL } from './config/env';
import { generateSentryConfig } from './config/sentry';
import buildDatabase, { mockContext, mockMembers } from './data/db';
import './index.css';
import Root from './modules/main/Root';

Sentry.init({
  integrations: [new BrowserTracing(), new Replay()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  ...generateSentryConfig(),
});

// setup mocked api for cypress or standalone app
/* istanbul ignore next */
if (MOCK_API) {
  mockApi({
    externalUrls: [OPEN_AI_API_URL],
    appContext: window.Cypress ? window.appContext : mockContext,
    database: window.Cypress
      ? window.database
      : buildDatabase(mockContext, mockMembers),
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
