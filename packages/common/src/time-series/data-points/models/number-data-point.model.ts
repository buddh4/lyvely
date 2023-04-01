import { Expose, Type as TransformType } from 'class-transformer';
import { TimerModel } from '@/calendar';
import { PropertyType } from '@/models';
import { DataPointModel } from './data-point.model';
import {
  DataPointValueType,
  INumberDataPointConfig,
  DataPointStrategy,
  IDataPointValueStatus,
  IDataPointConfig,
  DataPointInputType,
  INumberDataPointConfigRevision,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { PropertiesOf } from '@/utils';
import { isDefined, isNumber } from 'class-validator';

export class NumberDataPointModel extends DataPointModel<NumberDataPointModel> {
  @Expose()
  value: number;

  @Expose()
  @TransformType(() => TimerModel)
  @PropertyType(TimerModel)
  timer?: TimerModel;

  @Expose()
  valueType = DataPointValueType.Number;

  afterInit() {
    this.value = this.value ?? 0;
  }
}

export function isNumberDataPointConfig(
  config: IDataPointConfig,
): config is INumberDataPointConfig {
  return config.valueType === DataPointValueType.Number;
}
