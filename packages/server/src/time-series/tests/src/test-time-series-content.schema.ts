import { Prop, Schema } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig, NumberTimeSeriesContent, SpinnerNumberDataPointConfig,
  TimeSeriesContent, TimeSeriesContentSchemaFactory,
  TimeSeriesDataPointConfigSchema
} from '../../schemas';
import * as mongoose from 'mongoose';
import { DataPointInputStrategy } from 'lyvely-common';

@Schema()
export class TestTimeSeriesContent extends TimeSeriesContent<TestTimeSeriesContent> {
  @Prop()
  someTestField: string;
}

export type TestTimeSeriesContentDocument = TestTimeSeriesContent & mongoose.Document;
export const TestTimeSeriesContentSchema = TimeSeriesContentSchemaFactory.createForClass(TestTimeSeriesContent, [
  DataPointInputStrategy.CheckboxNumber,
  DataPointInputStrategy.TextareaText,
]);


@Schema()
export class TestNumberTimeSeriesContent extends NumberTimeSeriesContent<TestTimeSeriesContent> {
  @Prop()
  someTestField: string;

  @Prop({ type: TimeSeriesDataPointConfigSchema, required: true })
  dataPointConfig: CheckboxNumberDataPointConfig | SpinnerNumberDataPointConfig;
}

export type TestNumberTimeSeriesContentDocument = TestNumberTimeSeriesContent & mongoose.Document;
export const TestNumberTimeSeriesContentSchema = TimeSeriesContentSchemaFactory.createForClass(TestNumberTimeSeriesContent, [
  DataPointInputStrategy.CheckboxNumber,
  DataPointInputStrategy.TextareaText,
]);
