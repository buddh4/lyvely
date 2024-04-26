import { Exclude, Expose } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';
import type { BaseModelData } from '@lyvely/common';
import { BaseModel } from '@lyvely/common';
import { IChartSeriesDefinition } from '../interfaces';
import { TIME_SERIES_CHART } from './time-series-chart.category';
import { TimeSeriesConfigModel } from './time-series-config.model';

@Exclude()
export class TagScoreSeriesConfigModel<TID = string> extends TimeSeriesConfigModel {
  @IsMongoId()
  @IsOptional()
  @Expose()
  tagIds?: TID[];

  @Expose()
  override readonly type = CHART_SERIES_TAG_SCORE.id;

  constructor(data?: BaseModelData<TagScoreSeriesConfigModel<any>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const CHART_SERIES_TAG_SCORE: IChartSeriesDefinition = {
  id: 'analytics-tag-score',
  configType: TagScoreSeriesConfigModel,
  categoryTypes: [TIME_SERIES_CHART.id],
};
