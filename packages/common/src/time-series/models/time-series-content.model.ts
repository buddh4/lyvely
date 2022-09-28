import { ContentModel } from '@/content';
import { ISortable } from '@/models';
import { UserAssignmentStrategy } from '@/collab';
import { IDataPointConfig, IDataPointConfigRevision } from '../interfaces';
import { IsNumber, Min, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';

@Expose()
export class TimeSeriesContentModel<E extends IDataPointConfig = IDataPointConfig, TID = any>
  extends ContentModel<TimeSeriesContentModel>
  implements ISortable
{
  dataPointConfig: E;

  dataPointConfigHistory?: IDataPointConfigRevision[];

  @IsEnum(UserAssignmentStrategy)
  userStrategy: UserAssignmentStrategy;

  @IsNumber()
  @Min(0)
  sortOrder: number;
}
