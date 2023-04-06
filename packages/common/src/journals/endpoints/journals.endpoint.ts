import {
  CreateJournalModel,
  JournalModel,
  UpdateJournalModel,
  UpdateJournalResponse,
} from '../models';
import { Endpoint } from '@/endpoints';
import { UpdateDataPointModel, UpdateDataPointResponse } from '@/calendar-plan';
import { IEditModelService } from '@/models';
import { ITimeSeriesCalendarPlanService } from '@/time-series';

export interface IJournalsEndpointService
  extends ITimeSeriesCalendarPlanService<JournalModel>,
    IEditModelService<UpdateJournalResponse, CreateJournalModel, UpdateJournalModel> {
  updateDataPoint(cid: string, update: UpdateDataPointModel): Promise<UpdateDataPointResponse>;
}
export type JournalsEndpoint = Endpoint<IJournalsEndpointService>;
export const ENDPOINT_JOURNALS = 'journals';
