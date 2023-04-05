import { Expose } from 'class-transformer';
import { DataPointModel } from './data-point.model';
import { DataPointValueType, ITextDataPointConfig, IDataPointConfig } from '../interfaces';
import { BaseModel, PropertyType } from '@/models';
import { Type as TransformType } from 'class-transformer/types/decorators/type.decorator';
import { TimerModel } from '@/calendar';
import { IsNumber, Min } from 'class-validator';

export class TimerDataPointValueModel extends BaseModel<TimerDataPointValueModel> {
  @Expose()
  @TransformType(() => TimerModel)
  @PropertyType(TimerModel)
  timer: TimerModel;

  @Expose()
  @IsNumber()
  @Min(0)
  @PropertyType(Number, { default: 0 })
  ms: number;
}

export class TimerDataPointModel extends DataPointModel<TimerDataPointModel> {
  @Expose()
  @TransformType(() => TimerDataPointValueModel)
  @PropertyType(TimerDataPointValueModel)
  value: TimerDataPointValueModel;

  @Expose()
  valueType = DataPointValueType.Timer;
}

export function isTextDataPointConfig(config: IDataPointConfig): config is ITextDataPointConfig {
  return config.valueType === DataPointValueType.Text;
}
