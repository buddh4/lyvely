import { defineStore } from "pinia";
import { Status, useStatus } from "@/store/status";
import authRepository from "@/modules/users/repositories/auth.repository";
import { IUser } from "@lyvely/common";
import { setLocale } from "@/i18n";
import { localStorageManager, sessionStorageManager } from "@/util/storage";
import { useAsEmitter } from "@/util/emitter";
import { ref, computed } from "vue";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import repository from "@/repository";
import { eventBus } from "@/modules/core/events/global.emitter";
import { getDefaultLocale } from "@/util";

export const vid = localStorageManager.getStoredValue("visitorId");

type AuthStoreEvents = {
  logout: undefined;
};

let refreshPromise: Promise<void> | undefined = undefined;

export const useAuthStore = defineStore("profile", () => {
  const status = useStatus();
  const user = ref<IUser>();
  const emitter = useAsEmitter<AuthStoreEvents>();
  const visitorId = computed<string | undefined>({
    get: () => vid.getValue() as string | undefined,
    set: (value: string | undefined) => vid.setValue(value),
  });
  const tokenExpiration = ref(0);

  const isAuthenticated = computed(() => !!vid.getValue());
  // TODO: set locale from user..
  const locale = ref(getDefaultLocale());

  async function login(username: string, password: string): Promise<boolean> {
    try {
      await clear();
      status.setStatus(Status.LOADING);
      const {
        data: { user, vid, token_expiration },
      } = await authRepository.login(username, password);

      if (user && vid) {
        await setUser(user);
        status.setStatus(Status.SUCCESS);
        visitorId.value = vid;
        tokenExpiration.value = token_expiration;
      } else {
        status.setStatus(Status.ERROR);
      }
    } catch (err: any) {
      console.log(err);
      status.setStatus(Status.ERROR);
      status.setError(
        err?.response?.status === 401
          ? "Invalid username or password."
          : "User could not be authenticated."
      );
    }

    return isAuthenticated.value;
  }

  async function loadUser() {
    const {
      data: { user, token_expiration },
    } = await authRepository.loadUser();
    await setUser(user);
    tokenExpiration.value = token_expiration;
    return user;
  }

  async function logout() {
    await authRepository
      .logout(visitorId.value)
      .catch((err) => console.log(err));
    await clear();
    emitter.emit("logout");
  }

  async function clear() {
    useAuthStore().$reset();
    visitorId.value = undefined;
    localStorageManager.clear();
    sessionStorageManager.clear();
    emitter.emit("clear");
  }

  async function setUser(user: IUser) {
    this.user = user;
    if (user.locale) {
      await setLocale(user.locale);
    }
  }

  async function refreshToken() {
    if (!isAuthenticated.value) return Promise.reject();

    return (refreshPromise = refreshPromise
      ? refreshPromise
      : authRepository
          .refresh(this.visitorId)
          .then(({ data: { token_expiration } }) => {
            refreshPromise = undefined;
            tokenExpiration.value = token_expiration;
          }));
  }

  return {
    ...status,
    ...emitter,
    user,
    locale,
    visitorId,
    tokenExpiration,
    isAuthenticated,
    login,
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
    config.skipAuthRefresh = !useAuthStore().isAuthenticated;
    return config;
  });

  // Automatic refresh token call on failed request (401)
  createAuthRefreshInterceptor(repository, () => {
    const visitorId = useAuthStore().visitorId;

    if (!visitorId) {
      return Promise.reject();
    }

    return requestToken();
  });

  eventBus.on("app.mount.post", () => {
    setTimeout(autoRefreshTokenInterval, tokenExpiration);
  });
};

authRepositoryPlugin();
