import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/core';
import { EventEmitter2 } from 'eventemitter2';
import { IAppConfig } from '@lyvely/core-interface';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY } from '../app-config.constants';
import { ModuleAppConfigAssemblyEvent } from '../events';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService<ConfigurationPath & any>,
    private readonly emitter: EventEmitter2,
  ) {}

  /**
   * Returns the app config including module app configurations.
   */
  getAppConfig(): IAppConfig<any> {
    const config: IAppConfig<any> = {
      appName: this.configService.get('appName', 'lyvely'),
      docUrl: this.configService.get('docUrl') || 'https://docs.lyvely.app',
      modules: {},
    };

    this.emitter.emit(
      EVENT_MODULE_APP_CONFIG_ASSEMBLY,
      new ModuleAppConfigAssemblyEvent(config.modules),
    );

    return config;
  }
}
