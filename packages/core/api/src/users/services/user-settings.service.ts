import { Inject, Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '@/settings';
import { User } from '../schemas';
import { UserDao } from '../daos';
import { UserSettingsRegistry } from './user-settings.registry';

@Injectable()
export class UserSettingsService extends SettingsService<User> {
  protected logger = new Logger(UserSettingsService.name);

  @Inject()
  protected settingsRegistry: UserSettingsRegistry;

  @Inject()
  protected settingsDao: UserDao;
}
