import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    login_url: 'http://127.0.0.1:3000/auth/login',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config);
    },
    baseUrl: 'http://127.0.0.1:3000',
  },
});