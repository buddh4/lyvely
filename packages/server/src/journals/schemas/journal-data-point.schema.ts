import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { DataPoint } from '@/time-series';

@Schema({ timestamps: true, discriminatorKey: 'valueType' })
export class JournalDataPoint extends DataPoint {}

export const JournalDataPointSchema = SchemaFactory.createForClass(JournalDataPoint);
