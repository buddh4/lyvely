import { Exclude, Expose } from 'class-transformer';
import { IActivity, IActivityDataPoint } from '../interfaces';
import { IsDefined, IsInt, Min } from 'class-validator';
import { DocumentDto } from '../../model';

@Exclude()
export class ActivityDataPointDto extends DocumentDto<ActivityDataPointDto> implements IActivityDataPoint {
  @Expose()
  id: string;

  @Expose()
  @Min(0)
  @IsInt()
  @IsDefined()
  value: number;

  @Expose()
  @IsDefined()
  timingId: string;

  @Expose()
  @IsDefined()
  contentId: string;

  @Expose()
  @IsInt()
  @IsDefined()
  score: number;

  public static createForActivity(activity: IActivity, timingId: string) {
    return new ActivityDataPointDto({
      contentId: activity.id,
      timingId:timingId,
      score: 0,
      value: 0
    });
  }
}