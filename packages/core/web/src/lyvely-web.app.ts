import AppComponent from './App.vue';
import { UserAvatar } from '@/users';
import { ProfileAvatar } from '@/profiles';
import { setupI18n, translationAdapter } from '@/i18n';
import { router } from './lyvely.router';
import { resetStore, installModules, registerModules, useEventBus, LyvelyAppEmitter } from '@/core';
import { registerCoreModules } from './core.modules';
import { markRaw, App as VueApp, createApp } from 'vue';
import { createPinia, Pinia } from 'pinia';
import { I18n } from 'vue-i18n';
import { useDayJsDateTimeAdapter } from '@lyvely/dates';
import { initApiRepository, createApiUrl, DEFAULT_FALLBACK_LOCALE } from '@lyvely/interface';
import { createLyvelyUi } from '@lyvely/ui';
import type { ILyvelyWebApp, ILyvelyWebAppOptions } from '@/core';

export class LyvelyWebApp implements ILyvelyWebApp {
  vueApp: VueApp;
  pinia: Pinia;
  i18n: I18n;
  events: LyvelyAppEmitter;
  options: Required<ILyvelyWebAppOptions>;

  constructor(options: ILyvelyWebAppOptions = {}) {
    this.options = {
      env: 'production',
      baseUrl: import.meta.env.VITE_APP_ENV || 'http://127.0.0.1:3000',
      apiUrl: import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8080/api',
      fallbackLocale: DEFAULT_FALLBACK_LOCALE,
      modules: [],
      ...options,
    };
  }

  async init(selector?: string) {
    this.events = useEventBus();
    this.events.emit('app.init.pre', this);

    this.initApiRepository();
    registerCoreModules();
    this.registerModulesFromOptions();
    this.setupPinia();
    await this.setupI18n();
    this.createApp();

    if (selector) {
      this.mount(selector);
    }

    this.events.emit('app.init.post', this);

    return this;
  }

  private initApiRepository() {
    initApiRepository({
      apiUrl: this.options.apiUrl,
    });
  }

  private registerModulesFromOptions() {
    if (!this.options.modules?.length) return;
    registerModules(...this.options.modules);
  }

  private setupPinia() {
    this.pinia = createPinia();
    this.pinia.use(resetStore);
    this.pinia.use(({ store }) => {
      store.router = markRaw(router);
    });
  }

  private async setupI18n() {
    this.i18n = await setupI18n();
  }

  private createApp() {
    this.vueApp = createApp(AppComponent);
    this.vueApp.use(this.pinia);
    this.vueApp.use(router);
    this.vueApp.use(this.i18n);
    this.vueApp.use(
      createLyvelyUi({
        translationProvider: translationAdapter,
        env: this.options.env,
        avatarUrlProvider: (guid: string, v?: number) =>
          createApiUrl(`/avatars/${guid}`, v ? { v: v.toString() } : {}),
      })
    );
    this.setGlobalComponents();
    this.initDirectives();
    useDayJsDateTimeAdapter();
    installModules(this.vueApp);
  }

  mount(selector: string) {
    this.events.emit('app.mount.pre', this);
    this.vueApp.mount(selector);
    this.events.emit('app.mount.post', this);
  }

  private initDirectives() {}

  private setGlobalComponents() {
    this.vueApp.component('LyProfileAvatar', ProfileAvatar);
    this.vueApp.component('LyUserAvatar', UserAvatar);
  }
}
