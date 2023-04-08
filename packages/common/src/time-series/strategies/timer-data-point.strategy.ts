import {
  DataPointValueType,
  ITimerDataPointConfig,
  ITimerDataPointConfigRevision,
} from '../interfaces';
import { useDataPointStrategyFacade } from '../components';
import { PropertiesOf } from '@/utils';
import { isDefined, isNumber, validate } from 'class-validator';
import { DataPointStrategy } from './data-point.strategy';
import { TimerDataPointModel, TimerDataPointValueModel } from '../models';
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

    if (!value.timer && oldValue.timer) {
      value.timer = oldValue.timer;
      value.timer.overwrite(value.ms);
    }

    return value;
  }

  prepareConfig(config: ITimerDataPointConfig) {
    if (config.optimal > config.max) config.optimal = config.max;
    if (config.min > config.optimal) config.min = config.optimal;
    if (config.max > 0 && config.max < 1000) config.max = 1000;
    if (config.min > 0 && config.min < 1000) config.min = 1000;
    if (config.optimal > 0 && config.optimal < 1000) config.optimal = 1000;
  }

  getSettingKeys(): Array<keyof ITimerDataPointConfig> {
    return ['max', 'min', 'optimal'];
  }
}

useDataPointStrategyFacade().registerType(DataPointValueType.Timer, new TimerDataPointStrategy());
