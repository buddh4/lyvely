import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART,
  USER_SETTING_CALENDAR_PREFERENCE_YEARSTART,
} from '@lyvely/interface';
import { ProfileSettingsRegistry } from './services';

@Injectable()
export class ProfilesEvents implements OnModuleInit {
  constructor(private readonly settingsRegistry: ProfileSettingsRegistry) {}

  onModuleInit(): any {
    this.settingsRegistry.registerSettings([
      {
        key: USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART,
        type: Number,
        validator: (val: number) => val >= 0 && val <= 6,
      },
      {
        key: USER_SETTING_CALENDAR_PREFERENCE_YEARSTART,
        type: Number,
        validator: (val: number) => val >= 0 && val <= 6,
      },
    ]);
  }
}
