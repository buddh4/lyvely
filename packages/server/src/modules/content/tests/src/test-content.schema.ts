import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Content } from '../../schemas';


@Schema()
export class TestContentData {
  @Prop({ required: true })
  testData: string;
}

export const TestContentDataSchema = SchemaFactory.createForClass(TestContentData);

@Schema({ timestamps: true })
export class TestContent extends Content<TestContent> {
  @Prop({ type: TestContentDataSchema, required: true })
  data: TestContentData;
}

export const TestContentSchema = SchemaFactory.createForClass(TestContent);
export type TestContentDocument = TestContent & Document;