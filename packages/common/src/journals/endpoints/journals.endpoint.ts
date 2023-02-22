import { ICalendarPlanService } from '@/calendar-plan/interfaces/calendar-plan-service.interface';
import { JournalModel } from '@/journals';
import { Endpoint, StrictEndpoint } from '@/endpoints';
import { UpdateDataPointModel, UpdateDataPointResponse } from '@/calendar-plan';

export interface IJournalsEndpointService extends ICalendarPlanService<JournalModel> {
  updateDataPoint(cid: string, update: UpdateDataPointModel): Promise<UpdateDataPointResponse>;
}
export type JournalsEndpoint = Endpoint<IJournalsEndpointService>;
export const ENDPOINT_JOURNALS = 'journals';
