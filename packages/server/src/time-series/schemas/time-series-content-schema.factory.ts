import { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

const SchemaMapping = {};

export function registerLogValueStrategy(name: string, schema: mongoose.Schema) {
  SchemaMapping[name] = schema;
}

export class TimeSeriesContentSchemaFactory {
  static createForClass<TClass extends any = any>(target: Type<TClass>, valueConfigStrategies: string[]) {
    const Schema = SchemaFactory.createForClass(target);
    valueConfigStrategies.forEach((configStrategy) => {
      Schema.path<mongoose.Schema.Types.Subdocument>('dataPointConfig').discriminator(configStrategy, SchemaMapping[configStrategy]);
    })
    return Schema;
  }
}

