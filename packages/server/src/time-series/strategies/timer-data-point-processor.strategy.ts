import { IDataPointProcessorStrategy } from './data-point-processor.strategy';
import { TimerDataPoint, TimeSeriesContent } from '../schemas';
import { DataPointInputType, DataPointValueType } from '@lyvely/common';
import { User } from '@/users';
import { UpdateQuerySet } from '@/core';
import { useDataPointStrategyRegistry } from './data-point-processor-strategy.registry';
import { TimerDataPointContent } from '../interfaces';

export class TimerDataPointProcessorStrategy
  implements IDataPointProcessorStrategy<TimerDataPointContent, TimerDataPoint>
{
  postProcess(
    user: User,
    model: TimeSeriesContent<any>,
    dataPoint: TimerDataPoint,
  ): false | UpdateQuerySet<TimerDataPoint> {
    // TODO: maybe we can handle this in prepareValue
    if (model.timeSeriesConfig.inputType !== DataPointInputType.Timer) return false;
    if (dataPoint.timer.calculateTotalSpan() === dataPoint.value.ms) return false;

    dataPoint.timer.overwrite(dataPoint.value.ms, user);
    return { timer: dataPoint.timer };
  }
}

useDataPointStrategyRegistry().registerValueStrategy(
  DataPointValueType.Number,
  new TimerDataPointProcessorStrategy(),
);
