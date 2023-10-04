import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class AvatarModel extends BaseModel<AvatarModel> {
  @Expose()
  guid: string;

  @Expose()
  timestamp?: number;
}
