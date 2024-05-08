import { IChartSeriesDefinition } from '../interfaces';
import { TIME_SERIES_CHART } from './time-series-chart.category';
import { TimeSeriesConfigModel } from './time-series-config.model';
import { Exclude, Expose } from 'class-transformer';
import { IsHexColor, IsMongoId, IsOptional } from 'class-validator';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel } from '@lyvely/common';

@Exclude()
export class ProfileScoreSeriesConfigModel<TID = string> extends TimeSeriesConfigModel {
  @IsMongoId({ each: true })
  @IsOptional()
  @Expose()
  tagIds?: TID[];

  @Expose()
  @IsHexColor()
  @IsOptional()
  color?: string;

  @Expose()
  override readonly type = CHART_SERIES_PROFILE_SCORE.id;

  constructor(data?: BaseModelData<ProfileScoreSeriesConfigModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const CHART_SERIES_PROFILE_SCORE: IChartSeriesDefinition = {
  id: 'analytics-profile-score',
  configType: TimeSeriesConfigModel,
  categoryTypes: [TIME_SERIES_CHART.id],
} as const;
