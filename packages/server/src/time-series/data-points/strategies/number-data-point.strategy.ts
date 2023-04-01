import { IDataPointProcessorStrategy } from './data-point-processor.strategy';
import { NumberDataPoint } from '../schemas';
import { NumberTimeSeriesContent } from '@/time-series/content';
import { DataPointInputType, DataPointValueType } from '@lyvely/common';
import { User } from '@/users';
import { UpdateQuerySet } from '@/core';
import { useDataPointStrategyRegistry } from '@/time-series/data-points/strategies/data-point-processor-strategy.registry';

export class NumberDataPointStrategy
  implements IDataPointProcessorStrategy<NumberTimeSeriesContent, NumberDataPoint>
{
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
}

useDataPointStrategyRegistry().registerValueStrategy(
  DataPointValueType.Number,
  new NumberDataPointStrategy(),
);
