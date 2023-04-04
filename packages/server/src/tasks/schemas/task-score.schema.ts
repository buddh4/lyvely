import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ContentScore } from '@/content';

@Schema({ timestamps: true })
export class TaskScore extends ContentScore {}

export const TaskScoreSchema = SchemaFactory.createForClass(TaskScore);
