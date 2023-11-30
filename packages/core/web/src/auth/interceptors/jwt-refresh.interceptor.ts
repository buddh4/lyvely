import { useAuthStore } from '@/auth';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { useApiRepository, useApiRequestInterceptor } from '@lyvely/interface';
import { InternalAxiosRequestConfig } from 'axios';
import { eventBus } from '@/core';

const skipAutoRefreshInterceptor = function (config: InternalAxiosRequestConfig) {
  if (typeof config.skipAuthRefresh !== 'boolean') {
    config.skipAuthRefresh = !useAuthStore().isAuthenticated;
  }
  return config;
};

// Automatic refresh token call on failed request (401)
export const useAutoTokenRefresh = () => {
  let lastRefresh = Date.now();
  // default expiration, this will be overwritten after login/refresh/initial state loading
  let authTokenExpiration = 30_000;
  const repository = useApiRepository();

  const requestToken = () => {
    return useAuthStore()
      .refreshToken()
      .then(() => {
        lastRefresh = Date.now();
      });
  };

  const autoRefreshTokenInterval = () => {
    const authStore = useAuthStore();
    authTokenExpiration = authStore.authTokenExpiration || authTokenExpiration;

    // This is unstable if authTokenExpiration <= 5s which should not be the case anyways
    const refreshInterval =
      authTokenExpiration < 30_000
        ? Math.max(authTokenExpiration - 5_000, 5_000)
        : Math.max(authTokenExpiration - 30_000, 30_000);

    if (authStore.isAuthenticated && Date.now() - lastRefresh > refreshInterval) {
      requestToken().then(() => setTimeout(autoRefreshTokenInterval, refreshInterval));
    } else {
      setTimeout(autoRefreshTokenInterval, refreshInterval);
    }
  };

  useApiRequestInterceptor(skipAutoRefreshInterceptor);

  // Automatic refresh token call on failed request (401)
  createAuthRefreshInterceptor(repository, (options) => {
    const visitorId = useAuthStore().getVid();

    if (!visitorId || options?.config?.skipAuthRefresh) {
      return Promise.reject();
    }

    return requestToken();
  });

  eventBus.on('app.mount.post', () => {
    setTimeout(autoRefreshTokenInterval, authTokenExpiration);
  });
};
