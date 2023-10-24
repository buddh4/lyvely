import { Inject, Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '@/settings';
import { Profile } from '../schemas';
import { ProfileDao } from '../daos';

@Injectable()
export class ProfileSettingsService extends SettingsService<Profile> {
  protected logger = new Logger(ProfileSettingsService.name);

  @Inject()
  protected settingsDao: ProfileDao;
}
