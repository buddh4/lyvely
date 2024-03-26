import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { ChartType, IChartSeriesDefinition } from '../interfaces';
import { CHART_SERIES_TYPE_SCORE } from '../analytics.constants';

const allowedChartTypes = [ChartType.Line, ChartType.Bar, ChartType.Pie];

@Exclude()
export class ScoreChartSeriesConfigModel<TID = string> extends ChartSeriesConfigModel {
  @IsMongoId()
  @IsOptional()
  @Expose()
  uids?: TID[];

  @IsMongoId()
  @IsOptional()
  @Expose()
  tagIds?: TID[];

  @IsBoolean()
  @IsOptional()
  currentUser?: boolean;

  @Expose()
  override type = CHART_SERIES_TYPE_SCORE;

  @Expose()
  @IsEnum(allowedChartTypes)
  @PropertyType(String, { default: ChartType.Line })
  override chartType: ChartType;

  constructor(data?: BaseModelData<ScoreChartSeriesConfigModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const CHART_SERIES_DEFINITION_SCORE: IChartSeriesDefinition = {
  id: CHART_SERIES_TYPE_SCORE,
  configType: ScoreChartSeriesConfigModel,
  chartTypes: allowedChartTypes,
};
