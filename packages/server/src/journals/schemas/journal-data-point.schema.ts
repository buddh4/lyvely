import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint, NumberDataPoint, TextDataPoint } from '@/time-series';
import mongoose from 'mongoose';

@Schema({ timestamps: true, discriminatorKey: 'valueType' })
export class JournalDataPoint extends DataPoint {}

export const JournalDataPointSchema = SchemaFactory.createForClass(JournalDataPoint);

@Schema()
export class JournalNumberDataPoint extends NumberDataPoint {}

export const JournalNumberDataPointSchema = SchemaFactory.createForClass(JournalNumberDataPoint);

@Schema()
export class JournalTextDataPoint extends TextDataPoint {}

export const JournalTextDataPointSchema = SchemaFactory.createForClass(JournalTextDataPoint);
