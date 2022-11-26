import { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { DataPointConfig } from '@/time-series';

const SchemaMapping = {};

export function registerLogValueStrategy(name: string, schema: mongoose.Schema) {
  SchemaMapping[name] = schema;
}

export class TimeSeriesConfigSchemaFactory {
  static createForClass<TClass extends { timeSeries: DataPointConfig } = any>(
    target: Type<TClass>,
    valueConfigStrategies: string[],
  ) {
    const Schema = SchemaFactory.createForClass(target);
    valueConfigStrategies.forEach((configStrategy) => {
      const schema = SchemaMapping[configStrategy];
      if (schema) {
        Schema.path<mongoose.Schema.Types.Subdocument>('timeSeries').discriminator(
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
