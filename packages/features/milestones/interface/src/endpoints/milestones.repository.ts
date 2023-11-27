import { IMilestonesClient, ENDPOINT_MILESTONES } from './milestones.endpoint';
import { UpdateMilestoneModel } from '../models';
import { IProfileApiRequestOptions, useApi } from '@lyvely/interface';

const api = useApi<IMilestonesClient>(ENDPOINT_MILESTONES);

export default {
  async getAll(options?: IProfileApiRequestOptions) {
    return api.get<'getAll'>(options);
  },

  async getById(mid: string, options?: IProfileApiRequestOptions) {
    return api.get<'getById'>(mid, options);
  },

  async create(milestone: UpdateMilestoneModel, options?: IProfileApiRequestOptions) {
    return api.post<'create'>(milestone, {}, options);
  },

  async update(
    milestoneId: string,
    model: Partial<UpdateMilestoneModel>,
    options?: IProfileApiRequestOptions,
  ) {
    return api.put<'update'>(milestoneId, model, options);
  },
};
