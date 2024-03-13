import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { ICalendarPlanResponse } from '@lyvely/calendar-plan-interface';
import { MilestoneRelationModel } from './milestone-relation.model';

@Exclude()
export class MilestoneSearchResponse implements ICalendarPlanResponse<MilestoneModel> {
  @Expose()
  @PropertyType([MilestoneModel])
  models: MilestoneModel[];

  @Expose()
  @PropertyType([MilestoneRelationModel])
  relations: MilestoneRelationModel[];

  constructor(data: PropertiesOf<MilestoneSearchResponse>) {
    BaseModel.init(this, data);
  }
}
