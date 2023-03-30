import { NumberDataPointConfig, NumberDataPointConfigRevision } from '../schemas';
import { useDataPointConfigStrategyRegistry } from '../components';
import { TimeSeriesConfigStrategy } from '../interfaces';
import { DataPointInputType, DataPointValueType } from '@lyvely/common';
import { isDefined } from 'class-validator';
import { pick } from 'lodash';

export class NumberDataPointConfigStrategy
  implements TimeSeriesConfigStrategy<NumberDataPointConfig, NumberDataPointConfigRevision>
{
  createRevision(config: NumberDataPointConfig): NumberDataPointConfigRevision {
    return new NumberDataPointConfigRevision(config);
  }

  prepareUpdate(config: Partial<NumberDataPointConfig>) {
    return pick(config, ['max', 'min', 'inputType', 'userStrategy', 'interval', 'optimal']);
  }

  prepareConfig(config: NumberDataPointConfig) {
    if (!isDefined(config.max) && config.inputType === DataPointInputType.Checkbox) {
      config.max = 1;
    }

    if (config.max && config.inputType === DataPointInputType.Checkbox) {
      config.max = Math.min(8, config.max);
    }
  }
}

useDataPointConfigStrategyRegistry().registerValueStrategy(
  DataPointValueType.Number,
  new NumberDataPointConfigStrategy(),
);
