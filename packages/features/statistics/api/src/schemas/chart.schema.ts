import { BaseDocument, NestedSchema } from '@lyvely/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { getStringEnumValues, BaseModel } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import { getNumberEnumValues } from '@lyvely/common/src';

export enum ChartType {
  Line = 'line',
  Bar = 'bar',
}

export enum ChartState {
  InProgress = 'in-progress',
  Error = 'error',
  Ready = 'ready',
}

@NestedSchema()
export class ChartStatus extends BaseModel<Chart> {
  @Prop({ enum: getStringEnumValues(ChartState), required: true })
  state: ChartState;

  @Prop()
  errors?: string[];
}

const ChartStatusSchema = SchemaFactory.createForClass(ChartStatus);

@NestedSchema()
export class Chart extends BaseModel<Chart> {
  @Prop({ enum: getStringEnumValues(ChartState), required: true })
  state: ChartState;

  @Prop()
  errors?: string[];
}

@Schema()
export class Chart extends BaseDocument<Chart> {
  @Prop({ enum: getNumberEnumValues(CalendarInterval) })
  interval: CalendarInterval;

  @Prop({ type: ChartStatusSchema })
  status: ChartStatus;
}
