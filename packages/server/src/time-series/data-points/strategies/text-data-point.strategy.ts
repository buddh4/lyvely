import {
  IDataPointValueStrategy,
  InvalidDataPointValueTypeException,
} from '@/time-series/data-points/strategies/data-point-value.strategy';
import { TextDataPoint } from '../schemas';
import { TextTimeSeriesContent } from '@/time-series/content';
import { isString } from 'class-validator';
import { DataPointValueType, TextDataPointModel } from '@lyvely/common';
import { useDataPointValueStrategyRegistry } from '@/time-series/data-points/strategies/data-point-value-strategy.registry';
import { assureStringId } from '@/core';

export class TextDataPointStrategy
  implements IDataPointValueStrategy<TextTimeSeriesContent, TextDataPoint, string>
{
  prepareValue(model: TextTimeSeriesContent, dataPoint: TextDataPoint, value: string): string {
    if (!isString(value)) throw new InvalidDataPointValueTypeException();
    if ((model.timeSeriesConfig.required && <string>value).length) {
      throw new InvalidDataPointValueTypeException('required');
    }

    return value;
  }

  postProcess(): false {
    return false;
  }

  createModel(dataPoint: TextDataPoint): TextDataPointModel {
    return new TextDataPointModel({
      id: dataPoint.id,
      cid: assureStringId(dataPoint.cid),
      uid: dataPoint.uid ? assureStringId(dataPoint.uid) : undefined,
      interval: dataPoint.interval,
      date: dataPoint.date,
      tid: dataPoint.tid,
      value: dataPoint.value,
    });
  }
}

useDataPointValueStrategyRegistry().registerValueStrategy(
  DataPointValueType.Text,
  new TextDataPointStrategy(),
);
