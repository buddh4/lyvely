import { defineStore } from 'pinia';
import { localStorageManager, sessionStorageManager } from '@/core';
import { usePageStore } from '@/ui';
import { useI18nStore } from '@/i18n';
import { computed, ref } from 'vue';
import {
  ILoginResponse,
  useAuthClient,
  UserModel,
  UserStatus,
  VisitorMode,
} from '@lyvely/interface';
import { findByPath, queuePromise } from '@lyvely/common';
import { useLiveStore } from '@/live/stores/live.store';
import { useAppConfigStore } from '@/app-config';
import { PATH_LOGIN } from '@/auth';

export const storedVid = localStorageManager.getStoredValue('visitorId');
export const logoutToken = localStorageManager.getStoredValue('logoutToken');

export const useAuthStore = defineStore('user-auth', () => {
  const user = ref<UserModel>();
  const authClient = useAuthClient();
  const authTokenExpiration = ref(0);
  // Unfortunately this is a bit misleading, since visitors are considered as non-authenticated users
  // But per definition all users are visitors
  const visitorId = ref<string | undefined>(<string | undefined>storedVid.getValue());
  const i18nStore = useI18nStore();

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
    const { user, token_expiration } = await authClient.loadUser();
    await setUser(user);
    authTokenExpiration.value = token_expiration;
    return user;
  }

  async function logout(redirect = true) {
    try {
      if (redirect) usePageStore().setShowAppLoader(true);
      // TODO: If logout request fails we should set an additional header assuring to logout on next valid request
      await authClient.logout(visitorId.value);
      clear();
    } catch (e) {
      console.error(e);
      clear();
      logoutToken.setValue('1');
    }

    if (redirect) {
      // We use document.location instead of router here in order to force all stores to be cleared
      document.location = PATH_LOGIN;
    }
  }

  function getSetting<TResult = any>(key: string, defaultValue: TResult): TResult;
  function getSetting<TResult = any>(key: string, defaultValue?: undefined): TResult | undefined;
  function getSetting<TResult = any>(key: string, defaultValue?: TResult): TResult | undefined {
    return findByPath(user.value?.settings, key, { defaultValue });
  }

  function isAwaitingEmailVerification() {
    return user.value?.status === UserStatus.EmailVerification;
  }

  function clear() {
    useAuthStore().$reset();
    setVid(undefined);
    logoutToken.setValue(undefined);
    localStorageManager.clear();
    sessionStorageManager.clear();
  }

  function hasLogoutToken() {
    return logoutToken.getValue() === '1';
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
      await i18nStore.setActiveLocale(user.value.locale);
    } else {
      user.value.locale = i18nStore.locale;
    }

    if (user.value.timezone) {
      i18nStore.setTimezone(user.value.timezone);
    }

    useLiveStore().connectUser();
  }

  async function setUserLocale(locale: string) {
    if (user.value) {
      user.value.locale = locale;
    }

    return i18nStore.setActiveLocale(locale);
  }

  async function refreshToken() {
    const authStore = useAuthStore();
    const { isAuthenticated, visitorId } = useAuthStore();
    if (!isAuthenticated || !visitorId) return Promise.reject();

    return queuePromise('auth-store-refresh', () => authClient.refresh(visitorId!)).then(
      ({ token_expiration }) => {
        authStore.authTokenExpiration = token_expiration;
      },
    );
  }

  function isVisitorModeEnabled() {
    return useAppConfigStore().get('permissions')?.visitorStrategy.mode === VisitorMode.Enabled;
  }

  return {
    user,
    visitorId,
    getVid,
    setUserLocale,
    hasLogoutToken,
    getSetting,
    authTokenExpiration,
    isAuthenticated,
    isVisitorModeEnabled,
    refreshToken,
    isAwaitingEmailVerification,
    handleLogin,
    logout,
    loadUser,
  };
});
