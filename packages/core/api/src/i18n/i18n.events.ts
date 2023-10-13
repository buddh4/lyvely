import { Injectable } from '@nestjs/common';
import { I18n } from './components';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@/app-config';
import { I18N_MODULE_ID } from '@lyvely/core-interface';

@Injectable()
export class I18nEvents {
  constructor(private readonly i18n: I18n) {}

  @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY)
  handleModuleConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
    event.setModuleConfig(I18N_MODULE_ID, { locales: this.i18n.getEnabledLocaleDefinitions() });
  }
}
