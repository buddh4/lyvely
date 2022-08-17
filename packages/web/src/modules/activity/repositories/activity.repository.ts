import repository from "@/repository";
import { ActivityRangeResponseDto, DataPointIntervalFilter, CalendarIntervalEnum, MoveAction , SortResult } from "@lyvely/common";

const resource = "activities";

export default {
  async getByRange(filter: DataPointIntervalFilter) {
    return repository.get<ActivityRangeResponseDto>(`${resource}`, {
      params: filter
    });
  },

  getActivity(id: string) {
    return repository.get(`${resource}/${id}`);
  },

  sort(cid: string, interval: CalendarIntervalEnum, attachToId?: string) {
    return repository.post<SortResult[]>(`${resource}/${cid}/sort`, new MoveAction({
      interval: interval,
      attachToId: attachToId
    }));
  },

  archive(activityId: string) {
    return repository.post(`${resource}/${activityId}/archive`);
  },

  unarchive(activityId: string) {
    return repository.post(`${resource}/${activityId}/unarchive`);
  }
};
