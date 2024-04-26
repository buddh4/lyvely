import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel, PropertyType } from '@lyvely/common';
import { IChartSeriesDefinition } from '../interfaces';
import { TIME_SERIES_CHART } from './time-series-chart.category';
import { TimeSeriesConfigModel } from './time-series-config.model';

@Exclude()
export class UserScoreSeriesConfigModel<TID = string> extends TimeSeriesConfigModel {
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

  constructor(data?: BaseModelData<UserScoreSeriesConfigModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const CHART_SERIES_USER_SCORE: IChartSeriesDefinition = {
  id: 'analytics-user-score',
  configType: UserScoreSeriesConfigModel,
  categoryTypes: [TIME_SERIES_CHART.id],
};
