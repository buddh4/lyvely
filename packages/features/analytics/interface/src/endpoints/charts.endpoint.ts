import { IContentTypeClient, Endpoint, profileApiPrefix } from '@lyvely/interface';
import {
  ChartListModel,
  ChartModel,
  CreateChartModel,
  UpdateChartModel,
  UpdateChartSeriesModel,
} from '../models';

export interface IChartsEndpointClient
  extends IContentTypeClient<ChartModel, CreateChartModel, UpdateChartModel> {
  getCharts(): Promise<ChartListModel>;
  addSeries(cid: string, model: UpdateChartSeriesModel): Promise<ChartModel>;
  updateSeries(cid: string, sid: string, model: UpdateChartSeriesModel): Promise<ChartModel>;
  deleteSeries(cid: string, sid: string): Promise<ChartModel>;
}

export type ChartEndpoint = Endpoint<IChartsEndpointClient>;
export const API_ANALYTICS_CHARTS = profileApiPrefix('charts');

export const ChartsEndpointPaths = {
  ADD_SERIES: (cid: string) => `${cid}/series`,
  UPDATE_SERIES: (cid: string, sid: string) => `${cid}/series/${sid}`,
  DELETE_SERIES: (cid: string, sid: string) => `${cid}/series/${sid}`,
};
