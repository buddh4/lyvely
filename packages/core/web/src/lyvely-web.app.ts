import './styles/index.css';
import AppComponent from './App.vue';
import { UserAvatar } from '@/users';
import { ProfileAvatar } from '@/profiles';
import { setupI18n, translationAdapter } from '@/i18n';
import { router, registerRoutes } from './lyvely.router';
import {
  resetStore,
  IModuleLoaderOptions,
  eventBus,
  AppEvents,
  createApiUrl,
  installModules,
  importModules,
  registerModule,
  registerModules,
} from '@/core';
import { registerCoreModules } from './core.modules';
import { markRaw, App as VueApp, createApp } from 'vue';
import { createPinia, Pinia } from 'pinia';
import { I18n } from 'vue-i18n';
import { useDayJsDateTimeAdapter } from '@lyvely/dates';
import { createLyvelyUi } from '@lyvely/ui';
import { RouteRecordRaw } from 'vue-router';
import { IWebConfig } from '@/web-config/web-config.interface';
import { initWebConfig } from '@/web-config';

export interface ILyvelyWebAppOptions extends IModuleLoaderOptions {}

export class LyvelyWebApp {
  vueApp: VueApp;
  pinia: Pinia;
  i18n: I18n;
  events: AppEvents;
  options: ILyvelyWebAppOptions;
  config: IWebConfig;

  constructor(options: ILyvelyWebAppOptions = {}) {
    this.options = options;
  }

  async init() {
    this.config = await initWebConfig();
    this.events = eventBus;
    this.events.emit('app.init.pre');
    registerCoreModules();
    this.registerModulesFromOptions();
    await this.loadExternalModules();
    this.setupPinia();
    await this.setupI18n();
    this.createApp();
    this.events.emit('app.init.post', this);
    return this;
  }

  private registerModulesFromOptions() {
    if (!this.options.modules?.length) return;
    registerModules(...this.options.modules);
  }

  private async loadExternalModules() {
    if (!this.config.moduleImports) return;

    this.config.moduleImports?.map((moduleImport) => importModules(moduleImport));

    this.config.moduleImports.forEach((moduleGlobImport) => {});

    const moduleRoutes = <{ default: Array<RouteRecordRaw> }[]>(
      import.meta.glob('./modules/**/routes/index.ts', { eager: true })
    );

    for (const path in moduleRoutes) {
      const route = moduleRoutes[path];
      if (route.default) {
        registerRoutes(route.default);
      }
    }
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
        env: import.meta.env.VITE_APP_ENV,
        avatarUrlProvider: (guid: string, v?: number) =>
          createApiUrl(`/avatars/${guid}`, v ? { v: v.toString() } : {}),
      }),
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

  private initDirectives() {
    this.vueApp.directive('mobile-scrollbar', {
      mounted: (el) => {
        const isInitialized = false;

        const hide = (timeout = 0) =>
          window.setTimeout(() => el.classList.add('scrollbar-hidden'), timeout);

        hide();
        // ContentStream requires this
        hide(500);

        el.addEventListener('scroll', function () {
          if (!isInitialized) el.classList.remove('scrollbar-hidden');
        });
      },
    });
  }

  private setGlobalComponents() {
    this.vueApp.component('LyProfileAvatar', ProfileAvatar);
    this.vueApp.component('LyUserAvatar', UserAvatar);
  }
}
