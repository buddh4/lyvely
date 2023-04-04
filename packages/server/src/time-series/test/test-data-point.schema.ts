import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NumberDataPoint, DataPoint } from '@/time-series';

@Schema()
export class TestDataPoint extends DataPoint {}

export const TestDataPointPointSchema = SchemaFactory.createForClass(TestDataPoint);
export type TestDataPointDocument = TestDataPoint & mongoose.Document;