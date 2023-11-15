import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSettingsRegistry } from '@/users';

@Injectable()
export class UserAccountEvents implements OnModuleInit {
  constructor(private readonly settingsRegistry: UserSettingsRegistry) {}

  onModuleInit(): any {
    this.settingsRegistry.registerSettings([
      {
        key: 'calendar.weekStart',
        type: Number,
        validator: (val: number) => val >= 0 && val <= 6,
      },
      {
        key: 'calendar.weekStrategy',
        type: String,
        validator: (val: string) => ['iso', 'locale'].includes(val),
      },
    ]);
  }
}
