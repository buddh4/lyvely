import { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import { Schema, NestedSchema, Subdocument } from '@lyvely/core';
import { DataPointConfig } from './data-point-config.schema';

const SchemaMapping = {};

export function registerDataPointConfigStrategy(name: string, schema: Schema) {
  SchemaMapping[name] = schema;
}

@NestedSchema()
export class TimeSeriesConfigSchemaFactory {
  static createForClass<TClass extends { timeSeries: DataPointConfig } = any>(
    target: Type<TClass>,
    valueConfigStrategies: string[],
  ) {
    const Schema = SchemaFactory.createForClass(target);
    valueConfigStrategies.forEach((configStrategy) => {
      const schema = SchemaMapping[configStrategy];
      if (schema) {
        Schema.path<Subdocument>('timeSeries').discriminator(
          configStrategy,
          SchemaMapping[configStrategy],
        );
      } else {
        console.warn(`Unknown datapoint strategy ${configStrategy}`);
      }
    });
    return Schema;
  }
}
