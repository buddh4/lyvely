import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPointConfig, DataPointConfigRevision } from './data-point-config.schema';

/**
 * This data-point config schema describes a data point config without additional values and is mainly used as default
 * schema. In most cases a TimeSeriesContent type will define an own config schema or use one of the existing schemas
 * e.g. NumberDataPointSchema
 */
@Schema({ _id: false, timestamps: true, discriminatorKey: 'strategy' })
export class DefaultDataPointConfig extends DataPointConfig {
  setSettings() {/* Nothing todo here...*/}
  getSettings(): any {return;}
}

export const DefaultDataPointConfigSchema = SchemaFactory.createForClass(DefaultDataPointConfig);

@Schema({ _id: false, timestamps: true, strict: false })
export class DefaultDataPointConfigRevision extends DataPointConfigRevision {}

export const DefaultDataPointConfigRevisionSchema = SchemaFactory.createForClass(DefaultDataPointConfigRevision);




