import { Prop, Schema } from '@nestjs/mongoose';
import {
  TimeSeriesContent, TimeSeriesContentSchemaFactory, TimeSeriesDataPointConfig,
  TimeSeriesDataPointConfigSchema
} from '../../schemas';
import * as mongoose from 'mongoose';
import { DataPointInputStrategy } from 'lyvely-common';

@Schema()
export class TestTimeSeriesContent extends TimeSeriesContent<TestTimeSeriesContent> {
  @Prop()
  someTestField: string;

  @Prop({ type: TimeSeriesDataPointConfigSchema, required: true })
  dataPointConfig: TimeSeriesDataPointConfig;
}

export type TestTimeableContentDocument = TestTimeSeriesContent & mongoose.Document;
export const TestTimeSeriesContentSchema = TimeSeriesContentSchemaFactory.createForClass(TestTimeSeriesContent, [
  DataPointInputStrategy.CheckboxNumber,
  DataPointInputStrategy.TextareaText,
]);
