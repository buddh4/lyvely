import repository from "@/repository";
import { MoveAction,
  IJournal,
  JournalRangeResponse,
  UpdateJournalLogDto, UpdateJournalLogResultDto
, EditJournalDto } from "@lyvely/common";
import { MoveActivityEvent } from '@/modules/activity/store/activityStore';
import { AxiosResponse } from "axios";

const resource = "journals";

export default {
  async getByRange(filter: any): Promise<AxiosResponse<JournalRangeResponse>> {
    return repository.get<JournalRangeResponse>(`${resource}`, {
      params: filter.getAsParams()
    });
  },

  sort(event: MoveActivityEvent) {
   /* return repository.post(
     // `${resource}/${event.id}/sort`,
     // new MoveAction(event)
    );*/
  },

  archive(journalId: string) {
    return repository.post(`${resource}/${journalId}/archive`);
  },

  unarchive(journalId: string) {
    return repository.post(`${resource}/${journalId}/unarchive`);
  },

  async create(model: EditJournalDto) {
    return repository.post<IJournal>(`${resource}`, model);
  },

  async updateLog(journalId: string, dto: UpdateJournalLogDto) {
    return repository.post<UpdateJournalLogResultDto>(`${resource}/${journalId}/update-log`, dto);
  }
};
