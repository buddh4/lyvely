import { ConfigService } from '@nestjs/config';
import { type ConfigurationPath } from '@/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@/app-config';
import { PERMISSIONS_MODULE_ID, VisitorMode } from '@lyvely/interface';
import { Injectable } from '@nestjs/common';
import { CONFIG_PATH_PERMISSIONS } from '@/permissions/permissions.constants';

@Injectable()
export class PermissionEvents {
  constructor(private readonly configService: ConfigService<ConfigurationPath>) {}

  @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY)
  handleModuleConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
    event.setModuleConfig(
      PERMISSIONS_MODULE_ID,
      this.configService.get(CONFIG_PATH_PERMISSIONS, {
        visitorStrategy: {
          mode: VisitorMode.Disabled,
        },
        defaults: [],
      })
    );
  }
}
