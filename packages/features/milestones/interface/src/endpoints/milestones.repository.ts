import { IMilestonesClient, ENDPOINT_MILESTONES } from './milestones.endpoint';
import { UpdateMilestoneModel } from '../models';
import { useApi } from '@lyvely/interface';

const api = useApi<IMilestonesClient>(ENDPOINT_MILESTONES);

export default {
  async getAll() {
    return api.get<'getAll'>();
  },

  async getById(mid: string) {
    return api.get<'getById'>(mid);
  },

  async create(milestone: UpdateMilestoneModel) {
    return api.post<'create'>(milestone);
  },

  async update(milestoneId: string, model: Partial<UpdateMilestoneModel>) {
    return api.put<'update'>(milestoneId, model);
  },
};
