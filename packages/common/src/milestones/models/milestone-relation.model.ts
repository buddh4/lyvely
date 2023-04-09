import { TransformObjectId } from '@/utils';
import { Exclude, Expose } from 'class-transformer';
import { BaseModel } from '@/models';
import { CalendarInterval } from '@/calendar';

@Exclude()
export class MilestoneRelationModel extends BaseModel<MilestoneRelationModel> {
  @Expose()
  @TransformObjectId()
  cid: TObjectId;

  @Expose()
  title: string;

  @Expose()
  contentType: string;

  @Expose()
  interval?: CalendarInterval;

  @Expose()
  progress?: number;
}
