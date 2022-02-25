import { Prop } from '@nestjs/mongoose';
import {
  DataPointInputType,
  DataPointValueType,
  NumberDataPointSettings,
  SupporedLogValueInputTypes
} from 'lyvely-common';
import { AbstractTimeSeriesDataPointConfig } from './abstract-time-series-data-point.config';

export abstract class AbstractNumberDataPointConfig extends AbstractTimeSeriesDataPointConfig<NumberDataPointSettings> {

  @Prop({ enum: [DataPointValueType.Number], required: true, default: DataPointValueType.Number })
  valueType: DataPointValueType.Number = DataPointValueType.Number;

  @Prop({ enum: SupporedLogValueInputTypes[DataPointValueType.Number] })
  inputType?: DataPointInputType;

  @Prop({ default: 0, required: true })
  min?: number;

  @Prop({ default: 5, required: true })
  max?: number;

  @Prop({ default: 5, required: true })
  optimal?: number;

  constructor(inputType?: DataPointInputType, settings?: NumberDataPointSettings) {
    super(DataPointValueType.Number, inputType, settings);
  }

  setSettings(settings?: NumberDataPointSettings) {
    this.min = settings?.min ?? 0;
    this.max = settings?.max ?? 1;
    this.optimal = settings?.optimal ?? 0;
  }

  getSettings() {
    const { min, max, optimal } = this;
    return { min, max, optimal };
  }
}