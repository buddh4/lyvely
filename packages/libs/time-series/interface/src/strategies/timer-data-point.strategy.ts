import {
  DataPointValueType,
  ITimerDataPointConfig,
  ITimerDataPointConfigRevision,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { PropertiesOf, isNil, isNotNil } from '@lyvely/common';
import { isNumber, validate } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';
import { TimerDataPointModel, TimerDataPointValueModel } from '../models';
import { TimerModel } from '@lyvely/interface';

const TIMER_MIN_VALUE = 1000 * 10;

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
    value: TimerDataPointValueModel
  ): Promise<boolean> {
    if (value.timer) {
      const errors = await validate(new TimerModel(value.timer));
      if (errors.length) return false;
    }

    return isNumber(value.ms) && isNumber(config.max) && value.ms <= config.max;
  }

  prepareValue(
    config: ITimerDataPointConfig,
    value: TimerDataPointValueModel,
    oldValue: TimerDataPointValueModel
  ) {
    if (isNumber(config.max) && isNumber(value.ms)) {
      value.ms = Math.min(value.ms, config.max);
    }

    if (!value.timer && oldValue.timer) {
      value.timer = oldValue.timer;
      value.timer.overwrite(value.ms);
    }

    return value;
  }

  prepareConfig(config: ITimerDataPointConfig) {
    if (isNumber(config.max) && config.max < 0) config.max = 0;
    if (isNumber(config.min) && config.min < 0) config.min = 0;
    if (isNumber(config.optimal) && config.optimal < 0) config.optimal = 0;

    if (isNotNil(config.min) && isNil(config.max)) config.max = config.min;
    if (isNotNil(config.min) && isNotNil(config.max) && config.min > config.max)
      config.max = config.min;
    if (isNotNil(config.optimal) && isNotNil(config.max) && config.optimal > config.max)
      config.optimal = config.max;
    if (isNotNil(config.min) && isNotNil(config.optimal) && config.min > config.optimal)
      config.optimal = config.min;

    if (isNumber(config.max) && config.max > 0 && config.max < 1000) config.max = TIMER_MIN_VALUE;
    if (isNumber(config.min) && config.min > 0 && config.min < 1000) config.min = TIMER_MIN_VALUE;
    if (isNumber(config.optimal) && config.optimal > 0 && config.optimal < 1000)
      config.optimal = TIMER_MIN_VALUE;
  }

  getSettingKeys(): Array<keyof ITimerDataPointConfig> {
    return ['max', 'min', 'optimal'];
  }
}

useDataPointStrategyFacade().registerType(DataPointValueType.Timer, new TimerDataPointStrategy());
