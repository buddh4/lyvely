import { Injectable, OnModuleInit } from '@nestjs/common';
import { I18n } from './components';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@/app-config';
import { I18N_MODULE_ID, I18nAppConfig } from '@lyvely/interface';
import { loadDateTimeLocale } from '@lyvely/dates';

@Injectable()
export class I18nEvents implements OnModuleInit {
  constructor(private readonly i18n: I18n) {}

  async onModuleInit() {
    await Promise.all(this.i18n.getEnabledLocales().map((locale) => loadDateTimeLocale(locale)));
  }

  @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY)
  handleModuleAppConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
    event.setModuleConfig<I18nAppConfig>(I18N_MODULE_ID, {
      locales: this.i18n.getEnabledLocaleDefinitions(),
    });
  }
}
