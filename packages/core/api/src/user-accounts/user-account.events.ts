import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSettingsRegistry } from '@/users';
import {
  USER_SETTING_CALENDAR_PREFERENCE_WEEKSTART,
  USER_SETTING_CALENDAR_PREFERENCE_YEARSTART,
} from '@lyvely/interface';

@Injectable()
export class UserAccountEvents implements OnModuleInit {
  constructor(private readonly settingsRegistry: UserSettingsRegistry) {}

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
