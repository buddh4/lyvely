import { defineStore } from 'pinia';
import { Status, useStatus } from '@/store/status';
import authRepository from '@/modules/user/repositories/auth.repository';
import { IUser } from 'lyvely-common';
import { setI18nLanguage } from '@/i18n';
import { localStorageManager, sessionStorageManager } from '@/util/storage';
import { useAsEmitter } from '@/util/emitter';
import mitt from 'mitt';
import { Headers } from 'lyvely-common';
import repository from '@/repository';

export const visitorId = localStorageManager.getStoredValue('visitorId');

type AuthStoreEvents = {
  logout: undefined;
}

const emitter = mitt<AuthStoreEvents>();

let refreshPromise: Promise<void> | undefined = undefined;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    status: Status.INIT,
    user: undefined as IUser | undefined,
    errorMsg: undefined as string | undefined,
    visitorId: visitorId.getValue(),
    tokenExpiration: undefined as number | undefined
  }),
  getters: {
    emitter: () => emitter,
    isAuthenticated: (state) => !!state.visitorId,
  },
  actions: {
    async login(username: string, password: string): Promise<boolean> {
      try {
        await this.clear();
        this.setStatus(Status.LOADING);
        const { data: {user, vid, token_expiration} } = await authRepository.login(username, password);

        if(user && vid) {
          await this.setUser(user);
          this.setStatus(Status.SUCCESS);
          this.setVisitorId(vid);
          this.tokenExpiration = token_expiration;
        } else {
          this.setStatus(Status.ERROR);
        }
      } catch (err) {
        console.log(err);
        this.setStatus(Status.ERROR);
        this.setError((err?.response?.status === 401)
          ? "Invalid username or password."
          : "User could not be authenticated."
        );
      }

      return this.isAuthenticated;
    },
    async refreshToken() {
      if(!this.isAuthenticated) {
        return Promise.reject();
      }

      return refreshPromise = refreshPromise
        ? refreshPromise
        : authRepository.refresh(this.visitorId)
          .then(({data: { token_expiration }}) => {
            refreshPromise = undefined;
            this.tokenExpiration = token_expiration;
          });
    },
    async logout() {
      await authRepository.logout(visitorId.getValue()).catch((err) => console.log(err));
      await this.clear();
      this.emit('logout');
    },
    async loadUser() {
      const { data: { user, token_expiration} } = await authRepository.loadUser();
      await this.setUser(user);
      this.tokenExpiration = token_expiration;
      return user;
    },
    async clear() {
      this.$reset();
      this.visitorId = undefined;
      localStorageManager.clear();
      sessionStorageManager.clear();
      this.emit('clear');
    },
    setVisitorId(vid: string) {
      this.visitorId = vid;
      visitorId.setValue(vid);
    },
    setError(msg: string) {
      this.setStatus(Status.ERROR);
      this.errorMsg = msg;
    },
    async setUser(user: IUser) {
      this.user = user;
      await setI18nLanguage(user.locale);
    },
    ...useStatus(),
    ...useAsEmitter<AuthStoreEvents>()
  }
});
