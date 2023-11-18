import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ICalendarPlanResponse } from '@lyvely/calendar-plan-interface';
import { MilestoneRelationModel } from './milestone-relation.model';

@Exclude()
export class MilestoneSearchResponse
  extends BaseModel<MilestoneSearchResponse>
  implements ICalendarPlanResponse<MilestoneModel>
{
  @Expose()
  @PropertyType([MilestoneModel])
  models: MilestoneModel[];

  @Expose()
  @PropertyType([MilestoneRelationModel])
  relations: MilestoneRelationModel[];
}
