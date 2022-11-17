import { Prop, Schema } from '@nestjs/mongoose';
import {
  CheckboxNumberDataPointConfig,
  NumberTimeSeriesContent,
  SpinnerNumberDataPointConfig,
  TimeSeriesContent,
  TimeSeriesContentSchemaFactory,
  DefaultDataPointConfigSchema,
  DataPointConfigFactory,
} from '../../schemas';
import * as mongoose from 'mongoose';
import { DataPointInputType, DataPointValueType } from '@lyvely/common';

@Schema()
export class TestTimeSeriesContent extends TimeSeriesContent<TestTimeSeriesContent> {
  @Prop()
  someTestField: string;

  pushDataPointConfigRevision() {
    /* Nothing to-do */
  }
}

export type TestTimeSeriesContentDocument = TestTimeSeriesContent & mongoose.Document;
export const TestTimeSeriesContentSchema = TimeSeriesContentSchemaFactory.createForClass(TestTimeSeriesContent, [
  DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
  DataPointConfigFactory.getStrategyName(DataPointValueType.Text, DataPointInputType.Textarea),
]);

@Schema()
export class TestNumberTimeSeriesContent extends NumberTimeSeriesContent<TestNumberTimeSeriesContent> {
  @Prop()
  someTestField: string;

  @Prop({ type: DefaultDataPointConfigSchema, required: true })
  dataPointConfig: CheckboxNumberDataPointConfig | SpinnerNumberDataPointConfig;
}

export type TestNumberTimeSeriesContentDocument = TestNumberTimeSeriesContent & mongoose.Document;
export const TestNumberTimeSeriesContentSchema = TimeSeriesContentSchemaFactory.createForClass(
  TestNumberTimeSeriesContent,
  [
    DataPointConfigFactory.getStrategyName(DataPointValueType.Number, DataPointInputType.Checkbox),
    DataPointConfigFactory.getStrategyName(DataPointValueType.Text, DataPointInputType.Textarea),
  ],
);
