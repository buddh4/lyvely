import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_APP_CONFIG_ASSEMBLY, ModuleAppConfigAssemblyEvent } from '@/app-config';
import { USER_REGISTRATION_MODULE_ID, UserRegistrationMode } from '@lyvely/core-interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserRegistrationEvents {
  constructor(private readonly configService: ConfigService) {}

  @OnEvent(EVENT_MODULE_APP_CONFIG_ASSEMBLY)
  handleModuleConfigAssembly(event: ModuleAppConfigAssemblyEvent) {
    event.setModuleConfig(USER_REGISTRATION_MODULE_ID, {
      registrationMode: this.configService.get(
        'userRegistration.mode',
        UserRegistrationMode.PUBLIC,
      ),
    });
  }
}
