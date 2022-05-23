import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { buildMockLocalContext, mockServer } from '@graasp/apps-query-client';
import Root from './components/Root';
import { MOCK_API } from './config/settings';
import buildDatabase, { mockContext } from './data/db';

// setup mocked api for cypress or standalone app
if (MOCK_API) {
  // when using Cypress, the appContext will be passed using the window object
  const appContext = buildMockLocalContext(window.appContext ?? mockContext);
  // automatically append item id as a query string
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.get('itemId')) {
    searchParams.set('itemId', appContext.itemId);
    window.location.search = searchParams.toString();
  }
  const database = window.Cypress ? window.database : buildDatabase(appContext);
  const errors = window.apiErrors;
  // @ts-ignore
  mockServer({ database, appContext, errors });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
