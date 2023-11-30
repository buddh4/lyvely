import { useAuthStore } from '@/auth';
import { Headers, useApiRequestInterceptor } from '@lyvely/interface';
import { InternalAxiosRequestConfig } from 'axios';

export function useAPIVisitorInterceptor() {
  useApiRequestInterceptor((config: InternalAxiosRequestConfig) => {
    if (!useAuthStore().isAuthenticated) {
      config.headers.set(Headers.X_VISITOR_ACCESS, 1);
    }
    return config;
  });
}
