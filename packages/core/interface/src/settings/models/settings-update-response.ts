import { Expose } from 'class-transformer';
import { type PropertiesOf } from '@lyvely/common';

@Expose()
export class SettingsUpdateResponse {
  settings: Record<string, any>;

  constructor(data: PropertiesOf<SettingsUpdateResponse>) {
    this.settings = data.settings;
  }
}
