import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import type { PartialPropertiesOf } from '@lyvely/common';
import { Document } from '@lyvely/common';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { ChartType, IChartSeriesDefinition } from '../interfaces';
import { CHART_SERIES_TYPE_SCORE } from '../analytics.constants';

@Exclude()
export class ScoreChartSeriesConfigModel<TID = string> extends ChartSeriesConfigModel<TID> {
  @IsMongoId()
  @IsOptional()
  @Expose()
  uid?: string;

  @IsBoolean()
  @IsOptional()
  currentUser?: boolean;

  constructor(data?: PartialPropertiesOf<ScoreChartSeriesConfigModel<any>>) {
    super();
    Document.init(this, data);
  }
}

export const CHART_SERIES_DEFINITION_SCORE: IChartSeriesDefinition = {
  id: CHART_SERIES_TYPE_SCORE,
  configType: ScoreChartSeriesConfigModel,
  chartTypes: [ChartType.Graph],
};
