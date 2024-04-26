import { ChartConfig, ChartSchema } from './chart.schema';
import { Subdocument, type Type, Schema } from '@lyvely/api';
import { SchemaFactory } from '@nestjs/mongoose';
import { ChartSeriesConfig } from './chart-series-config.schema';

export class ChartSchemaFactory {
  static createForClass(category: string, type: Type<ChartConfig>): Schema<ChartConfig> {
    const Schema = SchemaFactory.createForClass(type);
    ChartSchema.path<Subdocument>('config').discriminator(category, Schema);
    return Schema;
  }

  static createSeriesForClass(
    seriesId: string,
    Config: Schema<ChartConfig>,
    type: Type<ChartSeriesConfig>,
  ): Schema<ChartSeriesConfig> {
    const Schema = SchemaFactory.createForClass(type);
    Config.path<Subdocument>('series').discriminator(seriesId, Schema);
    return Schema;
  }
}
