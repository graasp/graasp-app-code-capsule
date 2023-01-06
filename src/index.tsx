import React from 'react';
import ReactDOM from 'react-dom/client';

import { mockApi } from '@graasp/apps-query-client';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import Root from './components/Root';
import { OPEN_AI_API_URL } from './config/constants';
import { generateSentryConfig } from './config/sentry';
import { MOCK_API } from './config/settings';
import buildDatabase, { mockContext, mockMembers } from './data/db';
import './index.css';

Sentry.init({
  integrations: [new BrowserTracing(), new Sentry.Replay()],

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
