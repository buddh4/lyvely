import { ICalendarPlanService } from '@/calendar-plan/interfaces/calendar-plan-service.interface';
import {
  CreateJournalModel,
  JournalModel,
  UpdateJournalModel,
  UpdateJournalResponse,
} from '@/journals';
import { Endpoint } from '@/endpoints';
import { UpdateDataPointModel, UpdateDataPointResponse } from '@/calendar-plan';
import { IEditModelService } from '@/models';

export interface IJournalsEndpointService
  extends ICalendarPlanService<JournalModel>,
    IEditModelService<UpdateJournalResponse, CreateJournalModel, UpdateJournalModel> {
  updateDataPoint(cid: string, update: UpdateDataPointModel): Promise<UpdateDataPointResponse>;
}
export type JournalsEndpoint = Endpoint<IJournalsEndpointService>;
export const ENDPOINT_JOURNALS = 'journals';
