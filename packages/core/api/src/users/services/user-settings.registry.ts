import { Injectable } from '@nestjs/common';
import { SettingsRegistry } from '@/settings';

@Injectable()
export class UserSettingsRegistry extends SettingsRegistry {}
