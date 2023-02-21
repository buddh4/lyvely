import { ICalendarPlanService } from '@/calendar-plan/interfaces/calendar-plan-service.interface';
import { JournalModel } from '@/journals';
import { StrictEndpoint } from '@/endpoints';

export interface IJournalsEndpointService extends ICalendarPlanService<JournalModel> {}
export type JournalsEndpoint = StrictEndpoint<IJournalsEndpointService>;
export const ENDPOINT_JOURNALS = 'journals';
