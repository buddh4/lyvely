import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@/app-config';
import { FEATURE_MODULE_ID } from '@lyvely/interface';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath, ServerConfiguration } from '@/config';

@Injectable()
export class FeaturesEvents {
  constructor(
    private readonly configService: ConfigService<ServerConfiguration<ConfigurationPath>>
  ) {}

  @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY)
  handleModuleConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
    event.setModuleConfig(FEATURE_MODULE_ID, this.configService.get('features', {}));
  }
}
