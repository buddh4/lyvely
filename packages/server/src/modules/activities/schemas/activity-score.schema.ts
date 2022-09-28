import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ContentScore } from '../../content';

@Schema({ timestamps: true })
export class ActivityScore extends ContentScore {}

export const ActivityScoreSchema = SchemaFactory.createForClass(ActivityScore);
export type ActivityScoreDocument = ActivityScore & mongoose.Document;
