import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NumberDataPoint, DataPoint } from "../../schemas";

@Schema()
export class TestDataPoint extends DataPoint {}

export const TestDataPointPointSchema = SchemaFactory.createForClass(TestDataPoint);
export type TestDataPointDocument = TestDataPoint & mongoose.Document;

@Schema()
export class TestNumberDataPoint extends NumberDataPoint {}
export const TestNumberDataPointSchema = SchemaFactory.createForClass(TestNumberDataPoint);
export type TestNumberDataPointDocument = TestNumberDataPoint & mongoose.Document;
