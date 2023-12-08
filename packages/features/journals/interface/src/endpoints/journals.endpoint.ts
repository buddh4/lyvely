import {
  CreateJournalModel,
  JournalModel,
  UpdateJournalModel,
  UpdateJournalResponse,
} from '../models';
import { IEditModelClient, profileApiPrefix, Endpoint } from '@lyvely/interface';
import {
  UpdateDataPointModel,
  UpdateDataPointResponse,
  ITimeSeriesCalendarPlanClient,
} from '@lyvely/time-series-interface';

export interface IJournalsEndpointService
  extends ITimeSeriesCalendarPlanClient<JournalModel>,
    IEditModelClient<UpdateJournalResponse, CreateJournalModel, UpdateJournalModel> {
  updateDataPoint(cid: string, update: UpdateDataPointModel): Promise<UpdateDataPointResponse>;
}
export type JournalsEndpoint = Endpoint<IJournalsEndpointService>;
export const ENDPOINT_JOURNALS = profileApiPrefix('journals');

export const JournalsEndpoints = {
  SORT: (cid: string) => `${cid}/sort`,
  UPDATE_DATA_POINT: (cid: string) => `${cid}/update-data-point`,
};
