import './styles/index.css';
import resetStore from '@/util/reset-store.plugin';
import { markRaw, App, createApp } from 'vue';
import { createPinia, Pinia } from 'pinia';
import router from '@/router';
import AppComponent from '@/App.vue';
import { ModuleLoader } from '@/module.loader';
import { setupI18n, translate } from '@lyvely/i18n';
import { I18n } from 'vue-i18n';
import { useDayJsDateTimeAdapter } from '@lyvely/common';
import { eventBus, AppEvents } from '@/modules/core/events/global.emitter';
import { createLyvelyUi } from '@lyvely/ui';
import { createApiUrl } from '@/repository';
import UserAvatar from '@/modules/users/components/UserAvatar.vue';
import ProfileAvatar from '@/modules/profiles/components/ProfileAvatar.vue';

export class LyvelyApp {
  vueApp: App;
  pinia: Pinia;
  i18n: I18n;
  events: AppEvents;

  async init() {
    this.events = eventBus;
    this.events.emit('app.init.pre');
    this.setupPinia();
    await this.setupI18n();
    this.createApp();
    this.events.emit('app.init.post', this);
    return this;
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
    this.vueApp.use(ModuleLoader);
    this.vueApp.use(this.i18n);
    this.vueApp.use(
      createLyvelyUi({
        translationProvider: translate,
        env: import.meta.env.VITE_APP_ENV,
        avatarUrlProvider: (guid: string, v?: number) =>
          createApiUrl(`/avatars/${guid}`, v ? { v: v.toString() } : {}),
      }),
    );
    this.setGlobalComponents();
    this.initDirectives();
    useDayJsDateTimeAdapter();
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
