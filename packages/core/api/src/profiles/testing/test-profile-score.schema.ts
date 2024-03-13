import { ProfileScore } from '../schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class TestProfileScore extends ProfileScore {
  @Prop()
  text: string;
}

export const TestProfileScoreSchema = SchemaFactory.createForClass(TestProfileScore);
