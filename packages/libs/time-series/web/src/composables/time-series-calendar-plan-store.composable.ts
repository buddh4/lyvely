import {
  DataPointModel,
  TimeSeriesContentModel,
  TimeSeriesStore,
  ITimeSeriesCalendarPlanResponse,
  ITimeSeriesCalendarPlanService,
} from '@lyvely/time-series-interface';
import { formatDate, toTimingId } from '@lyvely/dates';
import { ContentFilter } from '@lyvely/interface';
import {
  ICalendarPlanOptions,
  useCalendarPlan,
  useCalendarPlanStore,
} from '@lyvely/calendar-plan-web';
import { storeToRefs } from 'pinia';
import { useProfileStore, useGlobalDialogStore, useContentStore } from '@lyvely/web';
import { isDefined } from 'class-validator';
import { useDebounceFn } from '@vueuse/core';

export interface ITimeSeriesCalendarPlanOptions<
  TModel extends TimeSeriesContentModel,
  TFilter extends ContentFilter<TModel>,
  TDataPoint extends DataPointModel = DataPointModel,
  TResponse extends ITimeSeriesCalendarPlanResponse<
    TModel,
    TDataPoint
  > = ITimeSeriesCalendarPlanResponse<TModel, TDataPoint>,
  TStore extends TimeSeriesStore<TModel, TDataPoint, TResponse> = TimeSeriesStore<
    TModel,
    TDataPoint,
    TResponse
  >,
  TService extends ITimeSeriesCalendarPlanService<
    TModel,
    TDataPoint,
    TResponse
  > = ITimeSeriesCalendarPlanService<TModel, TDataPoint, TResponse>,
> extends ICalendarPlanOptions<TModel, TFilter, TResponse, TStore, TService> {}

export function useTimeSeriesCalendarPlan<
  TModel extends TimeSeriesContentModel,
  TFilter extends ContentFilter<TModel>,
  TDataPoint extends DataPointModel = DataPointModel,
  TResponse extends ITimeSeriesCalendarPlanResponse<
    TModel,
    TDataPoint
  > = ITimeSeriesCalendarPlanResponse<TModel, TDataPoint>,
  TStore extends TimeSeriesStore<TModel, TDataPoint, TResponse> = TimeSeriesStore<
    TModel,
    TDataPoint,
    TResponse
  >,
  TService extends ITimeSeriesCalendarPlanService<
    TModel,
    TDataPoint,
    TResponse
  > = ITimeSeriesCalendarPlanService<TModel, TDataPoint, TResponse>,
>(
  options: ITimeSeriesCalendarPlanOptions<TModel, TFilter, TDataPoint, TResponse, TStore, TService>,
) {
  const profileStore = useProfileStore();
  const { locale } = storeToRefs(profileStore);
  const calendarPlanStore = useCalendarPlanStore();
  const calendarPlan = useCalendarPlan<TModel, TFilter, TResponse, TStore, TService>(options);
  const dialog = useGlobalDialogStore();

  const { cache, service } = calendarPlan;

  function getDataPoint(model: TimeSeriesContentModel) {
    const timingId = toTimingId(
      calendarPlanStore.date,
      model.timeSeriesConfig.interval,
      locale.value,
      profileStore.getSetting('calendar'),
    );
    return cache.value.getDataPoint(model, timingId, true);
  }

  async function updateDataPoint(
    dataPoint: DataPointModel,
    value: any,
    oldValue?: any,
    debounce = false,
  ) {
    if (debounce) {
      await debounceUpdate(dataPoint, value, oldValue);
      return;
    }

    try {
      dataPoint.value = value;
      const result = await service.updateDataPoint(dataPoint.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value,
      });

      cache.value.setModel(result.model as TModel);
      useContentStore().emitPostContentUpdateEvent(result.model.type, result.model);
      cache.value.setDataPoint(result.dataPoint as TDataPoint);
    } catch (e) {
      if (isDefined(oldValue)) {
        dataPoint.value = oldValue!;
      }
      dialog.showUnknownError();
    }
  }

  const debounceUpdate = useDebounceFn(
    (dataPoint: DataPointModel, selection: number, oldValue?: number) => {
      return updateDataPoint(dataPoint, selection, oldValue);
    },
    500,
  );

  return {
    ...calendarPlan,
    getDataPoint,
    updateDataPoint,
  };
}
