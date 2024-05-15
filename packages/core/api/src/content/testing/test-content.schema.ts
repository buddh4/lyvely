import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Content, ContentDataType } from '../schemas';
import { BaseModel, type BaseModelData } from '@lyvely/common';

@Schema()
export class TestContentData extends ContentDataType {
  @Prop({ required: true })
  testData: string;

  constructor(data: BaseModelData<TestContentData>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const TestContentDataSchema = SchemaFactory.createForClass(TestContentData);

@Schema()
export class TestContent extends Content {
  @Prop({ type: TestContentDataSchema, required: true })
  override content: TestContentData;
}

export const TestContentSchema = SchemaFactory.createForClass(TestContent);

@Schema()
export class TestContentDataB extends ContentDataType {
  @Prop({ required: true })
  testDataB: string;
}

export const TestContentDataBSchema = SchemaFactory.createForClass(TestContentDataB);

@Schema()
export class TestContentB extends Content {
  @Prop({ type: TestContentDataBSchema, required: true })
  override content: TestContentDataB;
}

export const TestContentBSchema = SchemaFactory.createForClass(TestContentB);
