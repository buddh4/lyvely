import repository from "@/repository";
import { ActivityRangeResponseDto, MoveActivityDto, DataPointIntervalFilter } from "lyvely-common";
import { AxiosResponse } from "axios";
import { MoveActivityEvent } from '@/modules/activity/store/activityStore';

const resource = "activities";

export default {
  async getByRange(filter: DataPointIntervalFilter): Promise<AxiosResponse<ActivityRangeResponseDto>> {
    return repository.get(`${resource}`, {
      params: filter
    });
  },

  getActivity(id: string) {
    return repository.get(`${resource}/${id}`);
  },

  sort(event: MoveActivityEvent) {
    return repository.post(`${resource}/${event.id}/sort`, new MoveActivityDto(event));
  },

  archive(activityId: string) {
    return repository.post(`${resource}/${activityId}/archive`);
  },

  unarchive(activityId: string) {
    return repository.post(`${resource}/${activityId}/unarchive`);
  }
};
