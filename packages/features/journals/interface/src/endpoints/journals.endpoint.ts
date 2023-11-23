import {
  CreateJournalModel,
  JournalModel,
  UpdateJournalModel,
  UpdateJournalResponse,
} from '../models';
import { Endpoint, IEditModelService } from '@lyvely/common';
import {
  UpdateDataPointModel,
  UpdateDataPointResponse,
  ITimeSeriesCalendarPlanClient,
} from '@lyvely/time-series-interface';

export interface IJournalsEndpointService
  extends ITimeSeriesCalendarPlanClient<JournalModel>,
    IEditModelService<UpdateJournalResponse, CreateJournalModel, UpdateJournalModel> {
  updateDataPoint(cid: string, update: UpdateDataPointModel): Promise<UpdateDataPointResponse>;
}
export type JournalsEndpoint = Endpoint<IJournalsEndpointService>;
export const ENDPOINT_JOURNALS = 'journals';

export const JournalsEndpointPaths = {
  SORT: (cid: string) => `${cid}/sort`,
  UPDATE_DATA_POINT: (cid: string) => `${cid}/update-data-point`,
};
