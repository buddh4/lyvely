import { ChartConfig } from './chart.schema';
import { Subdocument, type Type, Schema } from '@lyvely/api';
import { SchemaFactory } from '@nestjs/mongoose';
import { ChartSeriesConfig } from './chart-series-config.schema';
import { TimeSeriesChartConfigSchema } from './time-series-chart.schema';

export class ChartSeriesSchemaFactory {
  static createSeriesForClass(
    seriesId: string,
    Config: Schema<ChartConfig>,
    type: Type<ChartSeriesConfig>
  ): Schema<ChartSeriesConfig> {
    const Schema = SchemaFactory.createForClass(type);
    Config.path<Subdocument>('series').discriminator(seriesId, Schema);
    return Schema;
  }

  static createTimeSeriesForClass(
    seriesId: string,
    type: Type<ChartSeriesConfig>
  ): Schema<ChartSeriesConfig> {
    const Schema = SchemaFactory.createForClass(type);
    TimeSeriesChartConfigSchema.path<Subdocument>('series').discriminator(seriesId, Schema);
    return Schema;
  }
}
