import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ContentScore } from '@lyvely/core';

@Schema({ timestamps: true })
export class HabitScore extends ContentScore {}

export const HabitScoreSchema = SchemaFactory.createForClass(HabitScore);
