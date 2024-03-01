import { Expose } from 'class-transformer';
import type { IChartConfig, ChartAccumulation } from '../interfaces';
import { ChartType, GraphChartType } from '../interfaces';
import { Model, DocumentModel, PropertyType, TransformObjectId } from '@lyvely/common';
import { CalendarInterval } from '@lyvely/dates';
import type { PartialPropertiesOf } from '@lyvely/common';

@Expose()
export class GraphChartSeriesFilterModel<TID = string> {
  @TransformObjectId()
  uid?: TID;

  constructor(data: PartialPropertiesOf<GraphChartSeriesFilterModel<any>>) {
    Model.init(this, data);
  }
}

@Expose()
export class GraphChartSeriesModel<TID = string> extends DocumentModel<GraphChartSeriesModel<any>> {
  type: GraphChartType;

  @PropertyType(GraphChartSeriesFilterModel)
  filter: GraphChartSeriesFilterModel<TID>;

  accumulation?: ChartAccumulation;
}

@Expose()
export class GraphChartConfigModel implements IChartConfig {
  type = ChartType.Graph;

  interval: CalendarInterval;

  @PropertyType(GraphChartSeriesModel)
  series: GraphChartSeriesModel[];

  constructor(data: PartialPropertiesOf<GraphChartConfigModel>) {
    Model.init(this, data);
  }
}
