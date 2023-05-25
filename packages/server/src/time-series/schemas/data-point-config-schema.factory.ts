import { DataPointConfig } from './config/data-point-config.schema';
import { registerDataPointConfigStrategy } from './config/time-series-config-schema.factory';
import { SchemaFactory } from '@nestjs/mongoose';
import { registerDataPointStrategy } from './data-point-config.factory';
import { Type } from '@lyvely/common';
import { Logger } from '@nestjs/common';

const logger = new Logger('DataPointConfigSchemaFactory');

export class DataPointConfigSchemaFactory {
  static createForClass<TClass extends DataPointConfig>(strategy: string, target: Type<TClass>) {
    const schema = SchemaFactory.createForClass(target);
    registerDataPointConfigStrategy(strategy, schema);
    registerDataPointStrategy(strategy, target);
    logger.log(`Registered DataPointConfigStrategy '${strategy}'`);
    return schema;
  }
}
