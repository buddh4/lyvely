import { TextDataPointConfig, TextDataPointConfigRevision } from '../schemas';
import { useDataPointConfigStrategyRegistry } from './time-series-config-strategy.registry';
import { ITimeSeriesConfigStrategy } from './time-series-config.strategy';
import { DataPointValueType } from '@lyvely/common';
import { pick } from 'lodash';

export class TextDataPointConfigStrategy
  implements ITimeSeriesConfigStrategy<TextDataPointConfig, TextDataPointConfigRevision>
{
  createRevision(config: TextDataPointConfig): TextDataPointConfigRevision {
    return new TextDataPointConfigRevision(config);
  }

  prepareUpdate(config: Partial<TextDataPointConfig>) {
    return pick(config, ['inputType', 'required', 'interval']);
  }

  prepareConfig(config: TextDataPointConfig) {
    // Nothing todo...
  }
}

useDataPointConfigStrategyRegistry().registerValueStrategy(
  DataPointValueType.Text,
  new TextDataPointConfigStrategy(),
);
