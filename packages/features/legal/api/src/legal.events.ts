import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@lyvely/api';
import { LegalService } from './services';
import { ILegalAppConfig } from '@lyvely/legal-interface';
import { LEGAL_MODULE_ID } from './legal.constants';

@Injectable()
export class LegalEvents {
  constructor(private readonly legalService: LegalService) {}

  @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY, { async: true, promisify: true })
  async handleModuleConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
    event.setModuleConfig<ILegalAppConfig>(LEGAL_MODULE_ID, {
      sections: await this.legalService.getSections(),
    });
  }
}
