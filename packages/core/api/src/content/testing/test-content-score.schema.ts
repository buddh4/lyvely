import { ContentScore } from '../schemas';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema()
export class TestContentScore extends ContentScore {}

export const TestContentScoreSchema = SchemaFactory.createForClass(TestContentScore);

@Schema()
export class ExtendedTestContentScore extends ContentScore {
  @Prop({ type: String, required: true })
  special: string;

  getSpecialValue() {
    return '_' + this.special + '_';
  }
}

export const ExtendedTestContentScoreSchema =
  SchemaFactory.createForClass(ExtendedTestContentScore);
