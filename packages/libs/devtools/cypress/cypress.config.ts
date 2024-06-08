export const cypressConfig = {
  env: {
    login_url: 'http://127.0.0.1:3002/auth/login',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    async setupNodeEvents(on: any, config: any) {
      const setup = await import('./plugins/index');
      setup.default(on, config);
    },
    baseUrl: 'http://127.0.0.1:3002',
  },
};
