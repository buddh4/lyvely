import {
  ActivityModel,
  ActivityType,
  DataPointIntervalFilter,
  HabitModel,
  IActivityEndpointService,
  ICalendarPlanResponse,
  MoveAction,
  NumberDataPointModel,
  PropertiesOf,
  SortResponse,
  TaskModel,
  useSingleton,
} from '@lyvely/common';
import repository from '../repositories/activity.repository';
import { unwrapAndTransformResponse, unwrapResponse } from '@/modules/core';

export class ActivitiesService implements IActivityEndpointService {
  async getByFilter(
    filter: DataPointIntervalFilter,
  ): Promise<ICalendarPlanResponse<ActivityModel, NumberDataPointModel>> {
    const { models, dataPoints } = await unwrapResponse(repository.getByFilter(filter));
    return {
      models: models.map((activity) => this.transformActivity(activity)),
      dataPoints: dataPoints.map(
        (dataPoint) => new NumberDataPointModel(<PropertiesOf<NumberDataPointModel>>dataPoint),
      ),
    };
  }

  transformActivity(raw: PropertiesOf<ActivityModel>) {
    return raw.type === ActivityType.Task ? new TaskModel(raw) : new HabitModel(raw);
  }

  async sort(cid: string, move: MoveAction): Promise<SortResponse> {
    return unwrapAndTransformResponse(repository.sort(cid, move), SortResponse);
  }
}

export const useActivitiesService = useSingleton(() => new ActivitiesService());
