import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { NumberDataPoint } from "../../../interfaces/time-series";

@Schema({ timestamps: true })
export class HabitDataPoint extends NumberDataPoint {}

export const HabitDataPointSchema = SchemaFactory.createForClass(HabitDataPoint);
export type HabitDataPointDocument = HabitDataPoint & mongoose.Document;
