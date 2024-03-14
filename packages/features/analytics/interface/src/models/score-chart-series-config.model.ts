import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import type { BaseModelData } from '@lyvely/common';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { ChartType, IChartSeriesDefinition } from '../interfaces';
import { CHART_SERIES_TYPE_SCORE } from '../analytics.constants';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class ScoreChartSeriesConfigModel<TID = string> extends ChartSeriesConfigModel {
  @IsMongoId()
  @IsOptional()
  @Expose()
  uids?: TID[];

  @IsBoolean()
  @IsOptional()
  currentUser?: boolean;

  constructor(data?: BaseModelData<ScoreChartSeriesConfigModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const CHART_SERIES_DEFINITION_SCORE: IChartSeriesDefinition = {
  id: CHART_SERIES_TYPE_SCORE,
  configType: ScoreChartSeriesConfigModel,
  chartTypes: [ChartType.Graph],
};
