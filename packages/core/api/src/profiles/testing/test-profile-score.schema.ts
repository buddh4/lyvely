import { type ICreateProfileScore, ProfileScore } from '../schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { PartialPropertiesOf } from '@lyvely/common';
import { BaseDocument } from '@/core';
import { pick } from 'lodash';

@Schema({ timestamps: true })
export class TestProfileScore extends ProfileScore {
  @Prop()
  text: string;

  constructor(options: ICreateProfileScore, data: PartialPropertiesOf<TestProfileScore> = {}) {
    super(options, data);
    BaseDocument.init(this, pick(data, 'text'));
  }
}

export const TestProfileScoreSchema = SchemaFactory.createForClass(TestProfileScore);
