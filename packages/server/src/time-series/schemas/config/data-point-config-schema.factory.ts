import { registerLogValueStrategy } from '../time-series-config-schema.factory';
import { SchemaFactory } from '@nestjs/mongoose';
import { IDataPointStrategyType, registerDataPointStrategy } from './data-point-config.factory';
import { DataPointConfig } from './data-point-config.schema';

export class DataPointConfigSchemaFactory {
  static createForClass<TClass extends DataPointConfig>(strategy: string, target: IDataPointStrategyType<TClass>) {
    const schema = SchemaFactory.createForClass(target);
    registerLogValueStrategy(strategy, schema);
    registerDataPointStrategy(strategy, target);
    return schema;
  }
}
