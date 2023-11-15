import { Inject, Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '@/settings';
import { Profile } from '../schemas';
import { ProfileDao } from '../daos';
import { ProfileSettingsRegistry } from './profile-settings.registry';

@Injectable()
export class ProfileSettingsService extends SettingsService<Profile> {
  protected logger = new Logger(ProfileSettingsService.name);

  @Inject()
  protected settingsRegistry: ProfileSettingsRegistry;

  @Inject()
  protected settingsDao: ProfileDao;
}
