import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDataPointConfigSchema } from './abstract-data-point-config.schema';

@Schema({ timestamps: true, discriminatorKey: 'strategy' })
export class TimeSeriesDataPointConfig extends AbstractDataPointConfigSchema {
  setSettings() {/* Nothing todo here...*/}

  getSettings(): any {
    return;
  }
}

export const TimeSeriesDataPointConfigSchema = SchemaFactory.createForClass(TimeSeriesDataPointConfig);
