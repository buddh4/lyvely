import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ContentScore } from '@lyvely/content';

@Schema({ timestamps: true })
export class TaskScore extends ContentScore {}

export const TaskScoreSchema = SchemaFactory.createForClass(TaskScore);
