import {
  CalendarIntervalEnum,
  ContentFilter,
  DataPointModel,
  LoadedTimingIdStore,
  TimeSeriesContentModel,
  TimeSeriesDataPointStore,
  toTimingId,
  ICalendarPlanService,
  MoveAction,
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { ref, toRefs, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCalendarPlanStore } from '@/modules/calendar/stores/calendar-plan.store';
import { loadingStatus, Status, useStatus } from '@/store';
import { DialogExceptionHandler } from '@/modules/core/handler/exception.handler';

export interface IMoveEntryEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarIntervalEnum;
  toInterval: CalendarIntervalEnum;
}

export interface CalendarPlanOptions<
  TModel extends TimeSeriesContentModel,
  TFilter extends ContentFilter<TModel>,
  TDataPointModel extends DataPointModel = DataPointModel,
> {
  filter: TFilter;
  cache: TimeSeriesDataPointStore<TModel>;
  service: ICalendarPlanService<TModel, TDataPointModel>;
}

export function useCalendarPlan<
  TModel extends TimeSeriesContentModel,
  TFilter extends ContentFilter<TModel>,
>(options: CalendarPlanOptions<TModel, TFilter>) {
  const profileStore = useProfileStore();
  const calendarPlanStore = useCalendarPlanStore();

  options.filter.setTagProvider(() => profileStore.profile?.tags || []);
  const filter = ref(options.filter);
  const cache = ref(options.cache);
  const service = options.service;
  const { date } = storeToRefs(calendarPlanStore);
  const { profile } = toRefs(profileStore);
  const tidCache = ref(new LoadedTimingIdStore());
  const status = useStatus();

  function startWatch() {
    const unwatchDate = watch(date, () => loadModels());
    const unwatchProfile = watch(profile, async (newProfile, oldProfile) => {
      if (newProfile?.id !== oldProfile?.id) {
        await reset();
      }
    });

    return () => {
      unwatchDate();
      unwatchProfile();
    };
  }

  async function reset() {
    status.resetStatus();
    cache.value.reset();
    tidCache.value.reset();
    // TODO: we need a way of preserving some options from being reset (softReset), this is required when changing profiles on activities
    const type = filter.value.option('type');
    filter.value.reset();
    if (type) {
      filter.value.setOption('type', type);
    }
  }

  async function loadModels() {
    if (!profile.value) return;

    const intervalFilter = tidCache.value.getDataPointIntervalFilter(date.value);

    if (intervalFilter === false) {
      status.setStatus(Status.SUCCESS);
      return;
    }

    // TODO: Check if date already loaded + implement interval level query

    try {
      const response = await loadingStatus(service.getByFilter(intervalFilter), status);
      cache.value.setModels(response.models);
      cache.value.setDataPoints(response.dataPoints);
      //calendarPlanStore.addLoadedTimingIds(getTimingIdsByRange(datesToBeLoaded));
    } catch (e) {
      DialogExceptionHandler('An unknown error occurred while loading models.', this)(e);
    }
  }

  async function getModels(interval: CalendarIntervalEnum) {
    const tid = toTimingId(date.value, interval);
    return cache.value.getModelsByIntervalFilter(interval, filter.value, tid);
  }

  function selectTag(tagId: string) {
    filter.value.setOption('tagId', tagId);
  }

  async function move(moveEvent: IMoveEntryEvent, from?: TModel[], to?: TModel[]) {
    if (!from || !to) {
      console.assert(!!from && !!to, 'Unknown interval set on move event');
      return;
    }

    try {
      const model = cache.value.getModel(moveEvent.cid);
      const attachTo = moveEvent.newIndex > 0 ? to[moveEvent.newIndex - 1] : undefined;

      if (moveEvent.fromInterval !== moveEvent.toInterval) {
        model.timeSeriesConfig.interval = moveEvent.toInterval;
      }

      const sortResult = await service.sort(
        model.id,
        new MoveAction({ interval: moveEvent.toInterval, attachToId: attachTo?.id }),
      );

      sortResult.sort.forEach((update) => {
        const entry = cache.value.getModel(update.id);
        if (entry) {
          entry.meta.sortOrder = update.sortOrder;
        }
      });
    } catch (e) {
      // Todo: handle error...
    }
  }

  return {
    filter,
    cache,
    date,
    status,
    loadModels,
    getModels,
    selectTag,
    move,
    startWatch,
  };
}
