import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ContentScore } from '@lyvely/content';

@Schema({ timestamps: true })
export class HabitScore extends ContentScore {}

export const HabitScoreSchema = SchemaFactory.createForClass(HabitScore);
