import { DataPointModel, Type } from '@lyvely/common';
import { DataPoint } from '@/time-series';
import { SchemaFactory } from '@nestjs/mongoose';

const registry = new Map<string, Type<DataPoint>>();

export class DataPointSchemaFactory {
  static createForClass(valueType: string, type: Type<DataPoint>) {
    registry.set(valueType, type);
    return SchemaFactory.createForClass(type);
  }

  static getModelType(valueType: string) {
    return registry.get(valueType);
  }
}
