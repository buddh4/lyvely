import { registerLogValueStrategy } from '../schemas/time-series-config-schema.factory';
import { SchemaFactory } from '@nestjs/mongoose';
import { registerDataPointStrategy } from './data-point-config.factory';
import { DataPointConfig } from '../schemas/data-point-config.schema';
import { Type } from '@lyvely/common';
import { Logger } from '@nestjs/common';

const logger = new Logger('DataPointConfigSchemaFactory');

export class DataPointConfigSchemaFactory {
  static createForClass<TClass extends DataPointConfig>(strategy: string, target: Type<TClass>) {
    const schema = SchemaFactory.createForClass(target);
    registerLogValueStrategy(strategy, schema);
    registerDataPointStrategy(strategy, target);
    logger.log(`Registered DataPointConfigStrategy '${strategy}'`);
    return schema;
  }
}
