import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, PropertyType, TransformTo } from '@lyvely/models';
import { ICalendarPlanResponse } from '@lyvely/calendar-plan';
import { MilestoneRelationModel } from './milestone-relation.model';

@Exclude()
export class MilestoneSearchResponse
  extends BaseModel<MilestoneSearchResponse>
  implements ICalendarPlanResponse<MilestoneModel>
{
  @Expose()
  @TransformTo(MilestoneModel)
  @PropertyType([MilestoneModel])
  models: MilestoneModel[];

  @Expose()
  @TransformTo(MilestoneRelationModel)
  @PropertyType([MilestoneRelationModel])
  relations: MilestoneRelationModel[];
}
