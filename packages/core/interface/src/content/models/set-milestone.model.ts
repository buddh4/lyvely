import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { type PropertiesOf } from '@lyvely/common';

@Exclude()
export class SetMilestoneModel {
  @Expose()
  @IsMongoId()
  mid: string;

  constructor(data: PropertiesOf<SetMilestoneModel>) {
    this.mid = data.mid;
  }
}
