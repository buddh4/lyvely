import { Exclude, Expose } from 'class-transformer';
import { type PropertiesOf } from '@lyvely/common';

@Exclude()
export class AvatarModel {
  @Expose()
  guid: string;

  @Expose()
  timestamp?: number;

  constructor(data: PropertiesOf<AvatarModel>) {
    this.guid = data.guid;
    this.timestamp = data.timestamp;
  }
}
