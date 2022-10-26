import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Content } from '../../schemas';
import { ContentDataType } from '@/content/schemas/content-data-type.schema';

@Schema()
export class TestContentData extends ContentDataType {
  @Prop({ required: true })
  testData: string;
}

export const TestContentDataSchema = SchemaFactory.createForClass(TestContentData);

@Schema()
export class TestContent extends Content<TestContent> {
  @Prop({ type: TestContentDataSchema, required: true })
  data: TestContentData;
}

export const TestContentSchema = SchemaFactory.createForClass(TestContent);
export type TestContentDocument = TestContent & Document;
