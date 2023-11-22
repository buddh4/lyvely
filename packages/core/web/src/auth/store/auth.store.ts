import { defineStore } from 'pinia';
import { localStorageManager, sessionStorageManager, eventBus } from '@/core';
import { usePageStore } from '@/ui';
import { useI18nStore } from '@/i18n';
import { ref, computed } from 'vue';
import { AuthService, useAuthService } from '@/auth/services/auth.service';
import { ILoginResponse, useApiRepository, UserModel, UserStatus } from '@lyvely/core-interface';
import { findByPath, queuePromise } from '@lyvely/common';
import { useLiveStore } from '@/live/stores/live.store';

export const storedVid = localStorageManager.getStoredValue('visitorId');

export const useAuthStore = defineStore('user-auth', () => {
  const user = ref<UserModel>();
  const authService = new AuthService();
  const authTokenExpiration = ref(0);
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

  function getSetting<TResult = any>(key: string, defaultValue: TResult): TResult;
  function getSetting<TResult = any>(key: string, defaultValue?: undefined): TResult | undefined;
  function getSetting<TResult = any>(key: string, defaultValue?: TResult): TResult | undefined {
    return findByPath(user.value?.settings || {}, key, false, false) ?? defaultValue;
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

    return queuePromise('auth-store-refresh', () => useAuthService().refresh(visitorId!)).then(
      ({ token_expiration }) => {
        authStore.authTokenExpiration = token_expiration;
      },
    );
  }

  return {
    user,
    visitorId,
    getVid,
    setUserLocale,
    getSetting,
    authTokenExpiration,
    isAuthenticated,
    refreshToken,
    isAwaitingEmailVerification,
    handleLogin,
    logout,
    loadUser,
  };
});
