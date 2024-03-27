import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel, PropertyType } from '@lyvely/common';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { ChartType, IChartSeriesDefinition } from '../interfaces';

const allowedChartTypes = [ChartType.Line, ChartType.Bar];

@Exclude()
export class UserScoreSeriesConfigModel<TID = string> extends ChartSeriesConfigModel {
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
  @PropertyType(Boolean, { default: true })
  currentUser?: boolean;

  @Expose()
  override readonly type = CHART_SERIES_USER_SCORE.id;

  @Expose()
  @IsEnum(allowedChartTypes)
  @PropertyType(String, { default: ChartType.Line })
  override readonly chartType: ChartType;

  constructor(data?: BaseModelData<UserScoreSeriesConfigModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const CHART_SERIES_USER_SCORE: IChartSeriesDefinition = {
  id: 'analytics-user-score',
  configType: UserScoreSeriesConfigModel,
  chartTypes: [ChartType.Line, ChartType.Bar],
};
