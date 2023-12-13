import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/config';
import { EventEmitter2 } from 'eventemitter2';
import { IAppConfig, VisitorMode } from '@lyvely/interface';
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
      permissions: this.configService.get('permissions', {
        visitorStrategy: {
          mode: VisitorMode.Disabled,
        },
        defaults: [],
      }),
      modules: {},
    };

    this.emitter.emit(
      EVENT_MODULE_APP_CONFIG_ASSEMBLY,
      new ModuleAppConfigAssemblyEvent(config.modules),
    );

    return config;
  }
}
