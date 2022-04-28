import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ContentScore } from "../../content";

@Schema({ timestamps: true })
export class ActivityScoreAction extends ContentScore {}

export const ActivityScoreActionSchema = SchemaFactory.createForClass(ActivityScoreAction);
export type ActivityScoreActionDocument = ActivityScoreAction & mongoose.Document;
