import { Membership , ProfileScoreAction } from '../../schemas';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


export type TestScoreDocument = Membership & mongoose.Document;

@Schema({ timestamps: true })
export class TestProfileAction extends ProfileScoreAction<TestProfileAction> {
  @Prop()
  text: string;
}

export const TestScoreSchema = SchemaFactory.createForClass(TestProfileAction);
