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
  ITimeSeriesCalendarPlanService,
} from '@lyvely/time-series-interface';

export interface IJournalsEndpointService
  extends ITimeSeriesCalendarPlanService<JournalModel>,
    IEditModelService<UpdateJournalResponse, CreateJournalModel, UpdateJournalModel> {
  updateDataPoint(cid: string, update: UpdateDataPointModel): Promise<UpdateDataPointResponse>;
}
export type JournalsEndpoint = Endpoint<IJournalsEndpointService>;
export const ENDPOINT_JOURNALS = 'journals';
