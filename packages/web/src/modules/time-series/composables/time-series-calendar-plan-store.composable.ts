import {
  ContentFilter,
  DataPointModel,
  TimeSeriesContentModel,
  TimeSeriesStore,
  ITimeSeriesCalendarPlanResponse,
  toTimingId,
  ITimeSeriesCalendarPlanService,
  formatDate,
} from '@lyvely/common';
import {
  ICalendarPlanOptions,
  useCalendarPlan,
  useCalendarPlanStore,
} from '@/modules/calendar-plan';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { isDefined } from 'class-validator';
import { useGlobalDialogStore } from '@/modules/core/store/global.dialog.store';

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
  const { locale } = storeToRefs(useProfileStore());
  const calendarPlanStore = useCalendarPlanStore();
  const calendarPlan = useCalendarPlan<TModel, TFilter, TResponse, TStore, TService>(options);
  const dialog = useGlobalDialogStore();

  const { cache, service } = calendarPlan;

  function getDataPoint(model: TimeSeriesContentModel) {
    const timingId = toTimingId(
      calendarPlanStore.date,
      model.timeSeriesConfig.interval,
      locale.value,
    );
    return cache.value.getDataPoint(model, timingId, true);
  }

  async function updateDataPoint(log: DataPointModel, value: any, oldValue?: any) {
    try {
      log.value = value;
      const result = await service.updateDataPoint(log.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value,
      });

      cache.value.setDataPoint(result.dataPoint);
    } catch (e) {
      if (isDefined(oldValue)) {
        log.value = oldValue!;
      }
      dialog.showUnknownError();
    }
  }

  return {
    ...calendarPlan,
    getDataPoint,
    updateDataPoint,
  };
}
