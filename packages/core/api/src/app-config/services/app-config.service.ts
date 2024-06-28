import { Injectable } from '@nestjs/common';
import { LyvelyConfigService } from '@/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IAppConfig } from '@lyvely/interface';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY } from '../app-config.constants';
import { ModuleAppConfigAssemblyEvent } from '../events';
import { type OptionalUserRequest } from '@/users';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: LyvelyConfigService,
    private readonly emitter: EventEmitter2
  ) {}

  /**
   * Returns the app config including module app configurations.
   */
  getAppConfig(req: OptionalUserRequest): IAppConfig<any> {
    const config: IAppConfig<any> = {
      appName: this.configService.get('appName', 'lyvely'),
      docUrl: this.configService.get('docUrl', 'https://docs.lyvely.app'),
      modules: {},
    };

    this.emitter.emit(
      EVENT_MODULE_APP_CONFIG_ASSEMBLY,
      new ModuleAppConfigAssemblyEvent(config.modules, req)
    );

    return config;
  }
}
