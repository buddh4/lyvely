import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@/app-config';
import { PERMISSIONS_MODULE_ID, VisitorMode } from '@lyvely/interface';
import { Injectable } from '@nestjs/common';
import { LyvelyConfigService } from '@/config';
import type { PermissionConfig } from '@/permissions/interfaces';

@Injectable()
export class PermissionEvents {
  constructor(private readonly configService: LyvelyConfigService<PermissionConfig>) {}

  @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY)
  handleModuleConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
    event.setModuleConfig(
      PERMISSIONS_MODULE_ID,
      this.configService.getModuleConfig('permissions', {
        visitorStrategy: {
          mode: VisitorMode.Disabled,
        },
        defaults: [],
      })
    );
  }
}
