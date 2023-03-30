import { TextDataPointConfig, TextDataPointConfigRevision } from '../schemas';
import { useDataPointConfigStrategyRegistry } from '../components';
import { TimeSeriesConfigStrategy } from '../interfaces';
import { DataPointValueType } from '@lyvely/common';
import { pick } from 'lodash';

export class TextDataPointConfigStrategy
  implements TimeSeriesConfigStrategy<TextDataPointConfig, TextDataPointConfigRevision>
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
