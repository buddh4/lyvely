import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint, NumberDataPoint, TextDataPoint } from '@/time-series';

@Schema({ timestamps: true, discriminatorKey: 'valueType' })
export class JournalDataPoint extends DataPoint {}

export const JournalDataPointSchema = SchemaFactory.createForClass(JournalDataPoint);

@Schema()
export class JournalNumberDataPoint extends NumberDataPoint {}

export const JournalNumberDataPointSchema = SchemaFactory.createForClass(JournalNumberDataPoint);

@Schema()
export class JournalSelectionDataPoint extends TextDataPoint {}

export const JournalSelectionDataPointSchema =
  SchemaFactory.createForClass(JournalSelectionDataPoint);
