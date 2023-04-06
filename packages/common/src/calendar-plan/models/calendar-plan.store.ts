import { CalendarInterval } from '@/calendar';
import { sortBySortOrder } from '@/models';
import { ContentFilter } from '@/content';
import { ICalendarPlanEntry, ICalendarPlanResponse } from '../interfaces';

type TimeSeriesContentIdentity = ICalendarPlanEntry | string;

/**
 * This class is used to stores time series content and related data points.
 */
export class CalendarPlanStore<
  Model extends ICalendarPlanEntry = ICalendarPlanEntry,
  TResponse extends ICalendarPlanResponse<Model> = ICalendarPlanResponse<Model>,
> {
  protected models: Map<string, Model> = new Map();

  constructor(models?: Model[]) {
    if (models?.length) this.setModels(models);
  }

  reset() {
    this.models = new Map();
  }

  sort(models: Model[]): Model[] {
    return models.sort(sortBySortOrder);
  }

  protected getId(model: TimeSeriesContentIdentity) {
    if (typeof model === 'string') return model;

    return model.id.toString();
  }

  handleResponse(response: TResponse) {
    this.setModels(response.models);
  }

  setModel(model: Model) {
    this.models.set(this.getId(model), model);
  }

  setModels(models: Model[]) {
    const newModel = new Map(models.map((model) => [this.getId(model), model]));
    this.models = new Map([...this.models, ...newModel]);
  }

  getModel(model: TimeSeriesContentIdentity): Model {
    if (!this.hasModel(model)) {
      return null;
    }

    return this.models.get(this.getId(model));
  }

  getModels() {
    return Array.from(this.models.values());
  }

  hasModel(model: TimeSeriesContentIdentity) {
    return this.models.has(this.getId(model));
  }

  getModelsByIntervalFilter(
    interval: CalendarInterval,
    filter?: ContentFilter<Model, any>,
    tid?: string, // Todo: This is currently only used by task store, probably should move this to filter logic...
  ) {
    return this.filterModels((entry) => {
      return entry.interval === interval && (!filter || filter.check(entry));
    });
  }

  filterModels(filter: (entry: Model, index: number, arr: Model[]) => boolean): Model[] {
    return this.sort(Array.from(this.models.values()).filter(filter));
  }
}
