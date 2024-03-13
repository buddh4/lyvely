import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';

@Exclude()
export class MilestoneListResponse {
  @Expose()
  @PropertyType([MilestoneModel])
  models: MilestoneModel[];

  constructor(data: PropertiesOf<MilestoneListResponse>) {
    BaseModel.init(this, data);
  }
}
