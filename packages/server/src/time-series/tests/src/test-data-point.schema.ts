import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NumberDataPoint, TimedNumberDataPoint } from "../../schemas/number-data-point.schema";
import { DataPoint } from "../../schemas";

@Schema()
export class TestDataPoint extends DataPoint {}

export const TestDataPointPointSchema = SchemaFactory.createForClass(TestDataPoint);
export type TestDataPointDocument = TestDataPoint & mongoose.Document;

@Schema()
export class TestNumberDataPoint extends NumberDataPoint {}
export const TestNumberDataPointSchema = SchemaFactory.createForClass(TestNumberDataPoint);
export type TestNumberDataPointDocument = TestNumberDataPoint & mongoose.Document;

@Schema()
export class TestTimedNumberDataPoint extends TimedNumberDataPoint {}
export const TestTimedNumberDataPointPointSchema = SchemaFactory.createForClass(TestTimedNumberDataPoint);
export type TestTimedNumberDataPointDocument = TestTimedNumberDataPoint & mongoose.Document;


