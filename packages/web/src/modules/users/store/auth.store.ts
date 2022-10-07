import { defineStore } from "pinia";
import { loadingStatus, useStatus } from "@/store/status";
import { setLocale } from "@/i18n";
import { localStorageManager, sessionStorageManager } from "@/util/storage";
import { useAsEmitter } from "@/util/emitter";
import { ref, computed } from "vue";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import repository from "@/repository";
import { eventBus } from "@/modules/core/events/global.emitter";
import { getDefaultLocale } from "@/util";
import { AuthService } from "@/modules/users/services/auth.service";
import { ILoginResponse, UserModel, queuePromise } from "@lyvely/common";

export const storedVid = localStorageManager.getStoredValue("visitorId");

type AuthStoreEvents = {
  "auth.logout": undefined;
};

let refreshPromise: Promise<void> | undefined = undefined;

export const useAuthStore = defineStore("user-auth", () => {
  const user = ref<UserModel>();
  const authService = new AuthService();
  const emitter = useAsEmitter<AuthStoreEvents>();
  const tokenExpiration = ref(0);
  const locale = ref(getDefaultLocale());
  const visitorId = ref<string | undefined>(
    <string | undefined>storedVid.getValue()
  );

  const isAuthenticated = computed(() => !!visitorId.value);

  async function handleLogin(result: ILoginResponse) {
    clear();
    const { user, vid, token_expiration } = result;
    await setUser(user);
    setVid(vid);
    const test = isAuthenticated.value;
    const test2 = storedVid.getValue();
    const test3 = visitorId.value;
    debugger;
    tokenExpiration.value = token_expiration;
  }

  async function loadUser() {
    const { user, token_expiration } = await authService.loadUser();
    await setUser(user);
    tokenExpiration.value = token_expiration;
    return user;
  }

  async function logout() {
    await authService.logout(visitorId.value).catch(console.error);
    clear();
    this.router.push("/login");
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
  }

  async function refreshToken() {
    if (!isAuthenticated.value || !visitorId.value) return Promise.reject();

    return queuePromise("auth-store-refresh", () =>
      authService.refresh(visitorId.value!)
    ).then(({ token_expiration }) => {
      refreshPromise = undefined;
      tokenExpiration.value = token_expiration;
    });
  }

  return {
    user,
    locale,
    getVid,
    tokenExpiration,
    isAuthenticated,
    handleLogin,
    logout,
    refreshToken,
    loadUser,
  };
});

const authRepositoryPlugin = () => {
  let lastRefresh = Date.now();
  // default expiration, this will be overwritten after login/refresh/initial state loading
  let tokenExpiration = 30_000;

  const requestToken = () => {
    return useAuthStore()
      .refreshToken()
      .then(() => {
        lastRefresh = Date.now();
      });
  };

  const autoRefreshTokenInterval = () => {
    const authStore = useAuthStore();
    tokenExpiration = authStore.tokenExpiration || tokenExpiration;

    // The refresh interval uses a of 30 second margin
    const refreshInterval = Math.max(tokenExpiration - 30_000, 30_000);

    if (
      authStore.isAuthenticated &&
      Date.now() - lastRefresh > refreshInterval
    ) {
      requestToken().then(() =>
        setTimeout(autoRefreshTokenInterval, refreshInterval)
      );
    } else {
      setTimeout(autoRefreshTokenInterval, refreshInterval);
    }
  };

  repository.interceptors.request.use(function (config) {
    if (typeof config.skipAuthRefresh !== "boolean") {
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

    return Promise.resolve();

    return requestToken().catch((err) => {
      console.log(err);
    });
  });

  eventBus.on("app.mount.post", () => {
    setTimeout(autoRefreshTokenInterval, tokenExpiration);
  });
};

authRepositoryPlugin();
