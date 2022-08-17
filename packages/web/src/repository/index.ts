import Axios from "axios";
import { Icons } from '@/modules/ui/components/icon/Icons';
import { useAuthStore } from '@/modules/user/store/auth.store';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';
import createAuthRefreshInterceptor  from 'axios-auth-refresh';
import { eventBus } from '@/modules/core/events/global.emitter';
import { useProfileStore } from '@/modules/user/store/profile.store';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    skipProfileIdParam?: boolean;
  }
}

// TODO: abstract this away in config or something..
const baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
const repository = Axios.create({ baseURL });

repository.defaults.withCredentials = true

repository.interceptors.request.use(function (config) {
  config.skipAuthRefresh = !useAuthStore().isAuthenticated;
  return config;
});

repository.interceptors.request.use(function (config) {
  const profileStore = useProfileStore();
  if(!config.skipProfileIdParam && profileStore.profile) {
    if(config.params) {
      config.params.pid = profileStore.profile.id;
    } else {
      config.params = {pid: profileStore.profile.id};
    }

  }
  return config;
});

let lastRefresh = Date.now();

// Automatic refresh token call on failed request (401)
createAuthRefreshInterceptor(
  repository,
  failedRequest  => {
    const visitorId = useAuthStore().visitorId;

    if(!visitorId) {
      return Promise.reject();
    }

    return requestToken();
  },
);

const requestToken = () => {
  return useAuthStore().refreshToken().then(() => {
    lastRefresh = Date.now();
  })
}

// default expiration, this will be overwritten after login/refresh/initial state loading
let tokenExpiration = 30_000;

const autoRefreshTokenInterval = () => {
  const authStore = useAuthStore();
  tokenExpiration = authStore.tokenExpiration || tokenExpiration;

  // The refresh interval uses a of 30 second margin
  const refreshInterval = Math.max((tokenExpiration - 30_000), 30_000);

  if (authStore.isAuthenticated && Date.now() - lastRefresh > refreshInterval) {
    requestToken().then(() => setTimeout(autoRefreshTokenInterval, refreshInterval));
  } else {
    setTimeout(autoRefreshTokenInterval, refreshInterval);
  }
}

eventBus.on('app.mount.post', () => {
  setTimeout(autoRefreshTokenInterval, tokenExpiration);
})

repository.interceptors.response.use(undefined, error => {

  return new Promise((resolve, reject) => {
    console.error(error);
    if (!error.response) {
      console.log(error);
      useGlobalDialogStore().showError({
        icon: Icons.error_network.name,
        title: 'error.network.title',
        message: 'error.network.message'
      });
    } else if (error.response.status === 403) {
      console.warn('Unauthorized request detected...');
    }

    reject(error);
  });

});

export default repository;
