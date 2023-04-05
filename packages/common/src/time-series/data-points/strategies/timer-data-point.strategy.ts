import {
  DataPointValueType,
  ITimerDataPointConfig,
  ITimerDataPointConfigRevision,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { PropertiesOf } from '@/utils';
import { isDefined, isNumber, validate } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';
import {
  TimerDataPointModel,
  TimerDataPointValueModel,
} from '@/time-series/data-points/models/timer-data-point.model';
import { TimerModel } from '@/calendar';

export class TimerDataPointStrategy extends DataPointStrategy<
  TimerDataPointModel,
  ITimerDataPointConfig,
  ITimerDataPointConfigRevision,
  TimerDataPointValueModel
> {
  createDataPoint(raw: PropertiesOf<TimerDataPointModel>): TimerDataPointModel {
    return new TimerDataPointModel(raw);
  }

  async validateValue(
    config: ITimerDataPointConfig,
    value: TimerDataPointValueModel,
  ): Promise<boolean> {
    if (value.timer) {
      const errors = await validate(new TimerModel(value.timer));
      if (errors.length) return false;
    }

    return isNumber(value.ms) && value.ms <= config.max;
  }

  prepareValue(
    config: ITimerDataPointConfig,
    value: TimerDataPointValueModel,
    oldValue: TimerDataPointValueModel,
  ) {
    if (isDefined(config.max) && isNumber(value.ms)) {
      value.ms = Math.min(value.ms, config.max);
    }
    return value;
  }

  prepareConfig(config: ITimerDataPointConfig) {
    /** Nothing todo **/
  }

  getSettingKeys(): Array<keyof ITimerDataPointConfig> {
    return ['max', 'min', 'optimal'];
  }
}

useDataPointStrategyFacade().registerType(DataPointValueType.Text, new TimerDataPointStrategy());
