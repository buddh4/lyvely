import { ContentScore, type ICreateContentScore } from '../schemas';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import type { PartialPropertiesOf } from '@lyvely/common';

@Schema()
export class TestContentScore extends ContentScore {}

export const TestContentScoreSchema = SchemaFactory.createForClass(TestContentScore);

@Schema()
export class ExtendedTestContentScore extends ContentScore {
  @Prop({ required: true })
  special: string;

  constructor(
    options: ICreateContentScore,
    data: PartialPropertiesOf<ExtendedTestContentScore> = {}
  ) {
    super(options, data);
    if (data?.special) {
      this.special = data.special;
    }
  }

  getSpecialValue() {
    return '_' + this.special + '_';
  }
}

export const ExtendedTestContentScoreSchema =
  SchemaFactory.createForClass(ExtendedTestContentScore);
