import { Prop, Schema } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig, NumberTimeSeriesContent, SpinnerNumberDataPointConfig,
  TimeSeriesContent, TimeSeriesContentSchemaFactory,
  DefaultDataPointConfigSchema, DefaultDataPointConfig
} from '../../schemas';
import * as mongoose from 'mongoose';
import { DataPointInputStrategy } from '@lyvely/common';

@Schema()
export class TestTimeSeriesContent extends TimeSeriesContent<TestTimeSeriesContent> {
  @Prop()
  someTestField: string;

  pushDataPointConfigRevision(rev: DefaultDataPointConfig) {
    // Nothing todo
  }
}

export type TestTimeSeriesContentDocument = TestTimeSeriesContent & mongoose.Document;
export const TestTimeSeriesContentSchema = TimeSeriesContentSchemaFactory.createForClass(TestTimeSeriesContent, [
  DataPointInputStrategy.CheckboxNumber,
  DataPointInputStrategy.TextareaText,
]);


@Schema()
export class TestNumberTimeSeriesContent extends NumberTimeSeriesContent<TestNumberTimeSeriesContent> {
  @Prop()
  someTestField: string;

  @Prop({ type: DefaultDataPointConfigSchema, required: true })
  dataPointConfig: CheckboxNumberDataPointConfig | SpinnerNumberDataPointConfig;
}

export type TestNumberTimeSeriesContentDocument = TestNumberTimeSeriesContent & mongoose.Document;
export const TestNumberTimeSeriesContentSchema = TimeSeriesContentSchemaFactory.createForClass(TestNumberTimeSeriesContent, [
  DataPointInputStrategy.CheckboxNumber,
  DataPointInputStrategy.TextareaText,
]);
