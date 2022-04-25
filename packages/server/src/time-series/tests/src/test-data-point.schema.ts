import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NumberDataPoint } from "../../schemas/number-data-point.schema";


@Schema()
export class TestNumberTimingDataPoint extends NumberDataPoint {}

export const TestNumberTimingDataPointPointSchema = SchemaFactory.createForClass(TestNumberTimingDataPoint);
export type TestNumberTimingDataPointDocument = TestNumberTimingDataPoint & mongoose.Document;


