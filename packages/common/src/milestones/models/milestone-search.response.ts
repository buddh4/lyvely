import { Exclude, Expose } from 'class-transformer';
import { MilestoneModel } from './milestone.model';
import { BaseModel, PropertyType, TransformTo } from '@/models';
import { ICalendarPlanResponse } from '@/calendar-plan';
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
