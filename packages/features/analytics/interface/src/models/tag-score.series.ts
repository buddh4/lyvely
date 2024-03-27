import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { ChartType, IChartSeriesDefinition } from '../interfaces';

const chartTypes = [ChartType.Line, ChartType.Bar];

@Exclude()
export class TagScoreSeriesConfigModel<TID = string> extends ChartSeriesConfigModel {
  @IsMongoId()
  @IsOptional()
  @Expose()
  tagIds?: TID[];

  @Expose()
  override readonly type = CHART_SERIES_TAG_SCORE.id;

  @Expose()
  @IsEnum(chartTypes)
  @PropertyType(String, { default: ChartType.Line })
  override readonly chartType: ChartType;

  constructor(data?: BaseModelData<TagScoreSeriesConfigModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const CHART_SERIES_TAG_SCORE: IChartSeriesDefinition = {
  id: 'analytics-tag-score',
  configType: TagScoreSeriesConfigModel,
  chartTypes,
};
