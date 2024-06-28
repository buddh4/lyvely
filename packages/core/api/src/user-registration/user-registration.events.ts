import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@/app-config';
import {
  IUserRegistrationAppConfig,
  USER_REGISTRATION_MODULE_ID,
  UserRegistrationMode,
} from '@lyvely/interface';
import { LyvelyConfigService } from '@/config';
import type { UserRegistrationConfig } from './interfaces';

@Injectable()
export class UserRegistrationEvents {
  constructor(private readonly configService: LyvelyConfigService<UserRegistrationConfig>) {}

  @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY)
  handleModuleConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
    event.setModuleConfig<IUserRegistrationAppConfig>(USER_REGISTRATION_MODULE_ID, {
      registrationMode: this.configService.getModuleConfig('mode', UserRegistrationMode.PUBLIC),
    });
  }
}
