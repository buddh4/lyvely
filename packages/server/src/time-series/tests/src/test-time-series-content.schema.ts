import { Prop, Schema } from '@nestjs/mongoose';
import {
  TimeSeries, TimeSeriesContentSchemaFactory, TimeSeriesDataPointConfig,
  TimeSeriesDataPointConfigSchema
} from '../../schemas';
import * as mongoose from 'mongoose';
import { DataPointInputStrategy } from 'lyvely-common';

@Schema()
export class TestTimeSeriesContent extends TimeSeries<TestTimeSeriesContent> {
  @Prop()
  someTestField: string;

  @Prop({ type: TimeSeriesDataPointConfigSchema, required: true })
  dataPointConfig: TimeSeriesDataPointConfig;
}

export type TestTimeSeriesContentDocument = TestTimeSeriesContent & mongoose.Document;
export const TestTimeSeriesContentSchema = TimeSeriesContentSchemaFactory.createForClass(TestTimeSeriesContent, [
  DataPointInputStrategy.CheckboxNumber,
  DataPointInputStrategy.TextareaText,
]);
