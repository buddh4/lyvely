import {
  IDataPointValueStrategy,
  InvalidDataPointValueTypeException,
} from '@/time-series/data-points/strategies/data-point-value.strategy';
import { NumberDataPoint } from '../schemas';
import { NumberTimeSeriesContent } from '@/time-series/content';
import { isDefined, isNumber } from 'class-validator';
import { DataPointInputType, DataPointValueType, NumberDataPointModel } from '@lyvely/common';
import { User } from '@/users';
import { assureStringId, UpdateQuerySet } from '@/core';
import { useDataPointValueStrategyRegistry } from '@/time-series/data-points/strategies/data-point-value-strategy.registry';

export class NumberDataPointStrategy
  implements IDataPointValueStrategy<NumberTimeSeriesContent, NumberDataPoint, number>
{
  prepareValue(model: NumberTimeSeriesContent, dataPoint: NumberDataPoint, value: number): number {
    if (!isNumber(value)) throw new InvalidDataPointValueTypeException();

    if (isDefined(model.timeSeriesConfig.max)) {
      value = Math.min(value, model.timeSeriesConfig.max);
    }

    return value;
  }

  postProcess(
    user: User,
    model: NumberTimeSeriesContent,
    dataPoint: NumberDataPoint,
  ): false | UpdateQuerySet<NumberDataPoint> {
    if (model.timeSeriesConfig.inputType !== DataPointInputType.Time) return false;
    if (dataPoint.timer.calculateTotalSpan() === dataPoint.value) return false;

    dataPoint.timer.overwrite(dataPoint.value, user);
    return { timer: dataPoint.timer };
  }

  createModel(dataPoint: NumberDataPoint): NumberDataPointModel {
    return new NumberDataPointModel({
      id: dataPoint.id,
      cid: assureStringId(dataPoint.cid),
      uid: dataPoint.uid ? assureStringId(dataPoint.uid) : undefined,
      timer: dataPoint.timer,
      interval: dataPoint.interval,
      date: dataPoint.date,
      tid: dataPoint.tid,
      value: dataPoint.value,
    });
  }
}

useDataPointValueStrategyRegistry().registerValueStrategy(
  DataPointValueType.Number,
  new NumberDataPointStrategy(),
);
