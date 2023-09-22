import { Exclude, Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { BaseModel } from '@lyvely/models';

@Exclude()
export class SetMilestoneModel extends BaseModel<SetMilestoneModel> {
  @Expose()
  @IsMongoId()
  mid: string;
}
