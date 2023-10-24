import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ContentScore } from '@lyvely/core';

@Schema({ timestamps: true })
export class TaskScore extends ContentScore {}

export const TaskScoreSchema = SchemaFactory.createForClass(TaskScore);
