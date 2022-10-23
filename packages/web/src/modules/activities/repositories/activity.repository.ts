import repository from '@/repository';
import {
  ActivityRangeResponse,
  DataPointIntervalFilter,
  CalendarIntervalEnum,
  MoveAction,
  SortResult,
} from '@lyvely/common';

const resource = 'activities';

export default {
  async getByRange(filter: DataPointIntervalFilter) {
    return repository.get<ActivityRangeResponse>(`${resource}`, {
      params: filter,
    });
  },

  async getActivity(id: string) {
    return repository.get(`${resource}/${id}`);
  },

  async sort(cid: string, interval: CalendarIntervalEnum, attachToId?: string) {
    return repository.post<SortResult[]>(
      `${resource}/${cid}/sort`,
      new MoveAction({
        interval: interval,
        attachToId: attachToId,
      }),
    );
  },

  archive(activityId: string) {
    return repository.post(`${resource}/${activityId}/archive`);
  },

  unarchive(activityId: string) {
    return repository.post(`${resource}/${activityId}/unarchive`);
  },
};
