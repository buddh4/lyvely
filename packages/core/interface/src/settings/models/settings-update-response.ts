import { Expose } from 'class-transformer';
import { BaseModel } from '@lyvely/common';

@Expose()
export class SettingsUpdateResponse extends BaseModel<SettingsUpdateResponse> {
  settings: Record<string, any>;
}
