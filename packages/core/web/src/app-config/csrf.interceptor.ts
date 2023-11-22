import { useAppConfigStore } from './app-config.store';

export const csrfInterceptor = function (config) {
  const appConfigStore = useAppConfigStore();
  config.headers = config.headers || {};
  config.headers['csrf-token'] = appConfigStore.get('csrf_token') || '';
  return config;
};
