import { ProfileScore } from '../schemas';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TestProfileScore extends ProfileScore<TestProfileScore> {
  @Prop()
  text: string;
}

export const TestProfileScoreSchema = SchemaFactory.createForClass(TestProfileScore);
export type TestProfileScoreDocument = TestProfileScore & mongoose.Document;