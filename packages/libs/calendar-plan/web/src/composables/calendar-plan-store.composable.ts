import {
  CalendarInterval,
  toTimingId,
  getCalendarIntervalArray,
  ICalendarPreferences,
} from '@lyvely/dates';
import { SortResult } from '@lyvely/common';
import { ContentFilter } from '@lyvely/interface';
import { LoadedTimingIdStore } from '@/models';
import {
  ICalendarPlanService,
  CalendarPlanSort,
  ICalendarPlanEntry,
  CalendarPlanStore,
  ICalendarPlanResponse,
} from '@lyvely/calendar-plan-interface';
import {
  useProfileStore,
  loadingStatus,
  Status,
  useStatus,
  DialogExceptionHandler,
  useGlobalDialogStore,
  IDragEvent,
  useContentStore,
} from '@lyvely/web';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useCalendarPlanStore } from '@/stores';
import { dragEventToMoveEvent } from '@/utils';
import { IMoveEntryEvent } from '@/interfaces';

export interface ICalendarPlanOptions<
  TModel extends ICalendarPlanEntry,
  TFilter extends ContentFilter<TModel>,
  TResponse extends ICalendarPlanResponse<TModel> = ICalendarPlanResponse<TModel>,
  TStore extends CalendarPlanStore<TModel, TResponse> = CalendarPlanStore<TModel, TResponse>,
  TService extends ICalendarPlanService<TModel> = ICalendarPlanService<TModel>,
> {
  filter: TFilter;
  cache: TStore;
  contentTypes?: string[];
  service: TService;
}

export function useCalendarPlan<
  TModel extends ICalendarPlanEntry,
  TFilter extends ContentFilter<TModel>,
  TResponse extends ICalendarPlanResponse<TModel> = ICalendarPlanResponse<TModel>,
  TStore extends CalendarPlanStore<TModel, TResponse> = CalendarPlanStore<TModel, TResponse>,
  TService extends ICalendarPlanService<TModel> = ICalendarPlanService<TModel>,
>(options: ICalendarPlanOptions<TModel, TFilter, TResponse, TStore, TService>) {
  const profileStore = useProfileStore();
  const { profile, locale } = storeToRefs(profileStore);
  const calendarPlanStore = useCalendarPlanStore();

  options.contentTypes ??= [];
  options.filter.setTagProvider(() => profile.value?.tags || []);
  const filter = ref(options.filter);
  const cache = ref(options.cache);
  const service = options.service;
  const { date } = storeToRefs(calendarPlanStore);
  const tidCache = ref(new LoadedTimingIdStore());
  const status = useStatus();
  const contentStore = useContentStore();

  for (const contentType of options.contentTypes) {
    contentStore.onContentCreated(contentType, <any>setModel);
    contentStore.onContentUpdated(contentType, <any>setModel);
  }

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

    const intervalFilter = tidCache.value.getCalendarPlanFilter(date.value);

    if (intervalFilter === false) {
      status.setStatus(Status.SUCCESS);
      return;
    }

    // TODO: Check if date already loaded + implement interval level query

    try {
      const result = await loadingStatus(service.getByFilter(intervalFilter), status);
      cache.value.handleResponse(result as TResponse);
    } catch (e) {
      DialogExceptionHandler('An unknown error occurred while loading models.', this)(e);
    }
  }

  async function loadModel(cid: string) {
    if (!profile.value) return;

    const intervalFilter = tidCache.value.getCalendarPlanFilter(date.value);

    if (intervalFilter === false) {
      status.setStatus(Status.SUCCESS);
      return;
    }

    intervalFilter.cid = cid;

    // TODO: Check if date already loaded + implement interval level query

    try {
      const result = await loadingStatus(service.getByFilter(intervalFilter), status);
      cache.value.handleResponse(result as TResponse);
    } catch (e) {
      DialogExceptionHandler('An unknown error occurred while loading models.', this)(e);
    }
  }

  function getModels(interval: CalendarInterval): TModel[] {
    const tid = toTimingId(date.value, interval, locale.value, profileStore.getSetting('calendar'));
    return cache.value.getModelsByIntervalFilter(interval, filter.value as TFilter, tid);
  }

  function setModel(model: TModel) {
    cache.value.setModel(model);
  }

  function selectTag(tagId: string) {
    filter.value.setOption('tagId', tagId);
  }

  function isEmpty() {
    return cache.value.isEmpty();
  }

  async function sort(evt: IDragEvent | IMoveEntryEvent, to?: TModel[]) {
    const moveEvent = dragEventToMoveEvent(evt);

    to ??= getModels(moveEvent.toInterval);

    const isSameInterval = moveEvent.fromInterval === moveEvent.toInterval;

    const model = cache.value.getModel(moveEvent.cid) as ICalendarPlanEntry;
    const attachTo =
      moveEvent.newIndex > 0
        ? to[moveEvent.newIndex - (!isSameInterval || evt.oldIndex > evt.newIndex ? 1 : 0)]
        : undefined;

    if (!isSameInterval) {
      model.interval = moveEvent.toInterval;
    }

    const oldSortOrder = model.meta.sortOrder;
    // We manually set the sortOrder to prevent flickering
    model.meta.sortOrder = attachTo ? (attachTo.meta.sortOrder || 0) + 0.1 : 0;

    try {
      const sortResult = await service.sort(
        model.id,
        new CalendarPlanSort({ interval: moveEvent.toInterval, attachToId: attachTo?.id }),
      );

      sortResult.sort.forEach((update: SortResult) => {
        const entry = cache.value.getModel(update.id);
        if (entry) {
          entry.meta.sortOrder = update.sortOrder;
        }
      });
    } catch (e) {
      model.meta.sortOrder = oldSortOrder;
      useGlobalDialogStore().showUnknownError();
    }
  }

  return {
    filter,
    cache,
    date,
    status,
    reset,
    loadModels,
    loadModel,
    getModels,
    setModel,
    selectTag,
    sort,
    startWatch,
    isEmpty,
    service,
    intervals: getCalendarIntervalArray(),
  };
}
