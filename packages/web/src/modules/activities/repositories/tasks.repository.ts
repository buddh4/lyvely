import repository from '@/repository';
import { UpdateTaskStateModel, UpdateTaskDto, EndpointResult, ITasksEndpointService } from '@lyvely/common';

const resource = 'tasks';

export default {
  async create(activitiy: UpdateTaskDto) {
    return repository.post<EndpointResult<ITasksEndpointService['create']>>(`${resource}`, activitiy);
  },

  async setDone(id: string, dto: UpdateTaskStateModel) {
    return repository.post<EndpointResult<ITasksEndpointService['setDone']>>(`${resource}/${id}/done`, dto);
  },

  async setUndone(id: string, dto: UpdateTaskStateModel) {
    return repository.post<EndpointResult<ITasksEndpointService['setUndone']>>(`${resource}/${id}/undone`, dto);
  },

  async update(taskId: string, model: Partial<UpdateTaskDto>) {
    return repository.put<EndpointResult<ITasksEndpointService['update']>>(`${resource}/${taskId}`, model);
  },
};
