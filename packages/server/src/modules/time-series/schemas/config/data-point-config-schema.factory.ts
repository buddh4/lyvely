import { registerLogValueStrategy } from '../time-series-content-schema.factory';
import { SchemaFactory } from '@nestjs/mongoose';
import { DataPointStrategyType, registerDataPointStrategy } from './data-point-config.factory';
import { DataPointConfig } from './data-point-config.schema';

export class DataPointConfigSchemaFactory {
  static createForClass<TClass extends DataPointConfig>(strategy: string, target: DataPointStrategyType<TClass>) {
    const schema = SchemaFactory.createForClass(target);
    registerLogValueStrategy(strategy, schema);
    registerDataPointStrategy(strategy, target);
    return schema;
  }
}
