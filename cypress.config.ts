import registerCodeCoverageTask from '@cypress/code-coverage/task.js';
import { defineConfig } from 'cypress';

export default defineConfig({
  video: false,

  e2e: {
    retries: { runMode: 2, openMode: 0 },
    env: {
      VITE_API_HOST: process.env.VITE_API_HOST,
      VITE_MOCK_API: process.env.VITE_MOCK_API,
      VITE_GRAASP_APP_KEY: process.env.VITE_GRAASP_APP_KEY,
    },
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      registerCodeCoverageTask(on, config);
      return config;
    },
    baseUrl: `http://localhost:${process.env.VITE_PORT || 3000}`,
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
