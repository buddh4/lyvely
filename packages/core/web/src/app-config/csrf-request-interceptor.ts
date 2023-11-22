import { useAppConfigStore } from './app-config.store';
import { InternalAxiosRequestConfig } from 'axios';

export const csrfRequestInterceptor = function (config: InternalAxiosRequestConfig) {
  const appConfigStore = useAppConfigStore();
  config.headers = config.headers || {};
  config.headers['csrf-token'] = appConfigStore.get('csrf_token') || '';
  return config;
};
