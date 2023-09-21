import {
  CreateJournalModel,
  JournalModel,
  UpdateJournalModel,
  UpdateJournalResponse,
} from '../models';
import { Endpoint } from '@/endpoints';
import {
  UpdateDataPointModel,
  UpdateDataPointResponse,
  ITimeSeriesCalendarPlanService,
} from '@/time-series';
import { IEditModelService } from '@/models';

export interface IJournalsEndpointService
  extends ITimeSeriesCalendarPlanService<JournalModel>,
    IEditModelService<UpdateJournalResponse, CreateJournalModel, UpdateJournalModel> {
  updateDataPoint(cid: string, update: UpdateDataPointModel): Promise<UpdateDataPointResponse>;
}
export type JournalsEndpoint = Endpoint<IJournalsEndpointService>;
export const ENDPOINT_JOURNALS = 'journals';
