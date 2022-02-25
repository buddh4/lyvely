import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractTimeSeriesDataPointConfig } from './abstract-time-series-data-point.config';

@Schema({ timestamps: true, discriminatorKey: 'strategy' })
export class TimeSeriesDataPointConfig extends AbstractTimeSeriesDataPointConfig {
  setSettings() {/* Nothing todo here...*/}

  getSettings(): any {
    return;
  }
}

export const TimeSeriesDataPointConfigSchema = SchemaFactory.createForClass(TimeSeriesDataPointConfig);