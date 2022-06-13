import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { mockApi } from '@graasp/apps-query-client';
import Root from './components/Root';
import { MOCK_API } from './config/settings';
import buildDatabase, { mockContext } from './data/db';

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
