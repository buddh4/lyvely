import { defineStore } from 'pinia';
import { setLocale } from '@/i18n';
import { localStorageManager, sessionStorageManager } from '@/util/storage';
import { ref, computed } from 'vue';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import repository from '@/repository';
import { eventBus } from '@/modules/core/events/global.emitter';
import { getDefaultLocale } from '@/util';
import { AuthService } from '@/modules/auth/services/auth.service';
import { ILoginResponse } from '@lyvely/auth-interface';
import { queuePromise } from '@lyvely/common';
import { ILoginResponse, UserModel, UserStatus } from '@lyvely/users-interface';
import { useAppConfigStore } from '@/modules/app-config/store/app-config.store';
import { usePageStore } from '@/modules/core/store/page.store';
import { useLiveStore } from '@/modules/live/stores/live.store';

export const storedVid = localStorageManager.getStoredValue('visitorId');

export const useAuthStore = defineStore('user-auth', () => {
  const user = ref<UserModel>();
  const appConfigStore = useAppConfigStore();
  const authService = new AuthService();
  const authTokenExpiration = ref(0);
  const locale = computed(() => {
    return user.value?.locale || getDefaultLocale(appConfigStore.get('locales'));
  });
  const visitorId = ref<string | undefined>(<string | undefined>storedVid.getValue());

  const isAuthenticated = computed(() => !!visitorId.value);

  async function handleLogin(result: ILoginResponse) {
    clear();
    const { user, vid, token_expiration } = result;
    if (user && vid) {
      await setUser(user);
      setVid(vid);
    }

    authTokenExpiration.value = token_expiration || authTokenExpiration.value;
  }

  async function loadUser() {
    const { user, token_expiration } = await authService.loadUser();
    await setUser(user);
    authTokenExpiration.value = token_expiration;
    return user;
  }

  async function logout(redirect = true) {
    if (redirect) usePageStore().setShowAppLoader(true);
    await authService.logout(visitorId.value).catch(console.error);
    // TODO: If logout request fails we should set an additional header assuring to logout on next valid request
    clear();

    if (redirect) {
      // We use document.location instead of router here in order to force stores to be cleared
      document.location = '/';
    }
  }

  function isAwaitingEmailVerification() {
    return user.value?.status === UserStatus.EmailVerification;
  }

  function clear() {
    useAuthStore().$reset();
    setVid(undefined);
    localStorageManager.clear();
    sessionStorageManager.clear();
  }

  function setVid(vid?: string) {
    visitorId.value = vid;
    storedVid.setValue(vid);
  }

  function getVid() {
    return visitorId.value;
  }

  async function setUser(authUser: UserModel) {
    user.value = authUser;
    if (user.value.locale) {
      await setLocale(user.value.locale);
    }
    useLiveStore().connectUser();
  }

  async function refreshToken() {
    if (!isAuthenticated.value || !visitorId.value) return Promise.reject();

    return queuePromise('auth-store-refresh', () => authService.refresh(visitorId.value!)).then(
      ({ token_expiration }) => {
        authTokenExpiration.value = token_expiration;
      },
    );
  }

  return {
    user,
    locale,
    getVid,
    authTokenExpiration,
    isAuthenticated,
    isAwaitingEmailVerification,
    handleLogin,
    logout,
    refreshToken,
    loadUser,
  };
});

const authRepositoryPlugin = () => {
  let lastRefresh = Date.now();
  // default expiration, this will be overwritten after login/refresh/initial state loading
  let authTokenExpiration = 30_000;

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

  repository.interceptors.request.use(function (config) {
    if (typeof config.skipAuthRefresh !== 'boolean') {
      config.skipAuthRefresh = !useAuthStore().isAuthenticated;
    }
    return config;
  });

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

authRepositoryPlugin();
