import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Content, ContentDataType } from '../schemas';

@Schema()
export class TestContentData extends ContentDataType {
  @Prop({ required: true })
  testData: string;
}

export const TestContentDataSchema = SchemaFactory.createForClass(TestContentData);

@Schema()
export class TestContent extends Content<TestContent> {
  @Prop({ type: TestContentDataSchema, required: true })
  content: TestContentData;
}

export const TestContentSchema = SchemaFactory.createForClass(TestContent);

@Schema()
export class TestContentDataB extends ContentDataType {
  @Prop({ required: true })
  testDataB: string;
}

export const TestContentDataBSchema = SchemaFactory.createForClass(TestContentDataB);

@Schema()
export class TestContentB extends Content<TestContent> {
  @Prop({ type: TestContentDataBSchema, required: true })
  content: TestContentDataB;
}

export const TestContentBSchema = SchemaFactory.createForClass(TestContentB);
