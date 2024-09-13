import {
  DataPointModel,
  TimeSeriesContentModel,
  TimeSeriesStore,
  ITimeSeriesCalendarPlanResponse,
  ITimeSeriesCalendarPlanClient,
  buildDataPointUpdateEventName,
  DatapointUpdateLiveEvent,
  DataPointValueType,
  TimerDataPointValueModel,
} from '@lyvely/time-series-interface';
import { formatDate, toTimingId } from '@lyvely/dates';
import { type PropertiesOf } from '@lyvely/common';
import { ContentFilter } from '@lyvely/interface';
import {
  ICalendarPlanOptions,
  useCalendarPlan,
  useCalendarPlanStore,
} from '@lyvely/calendar-plan-web';
import { storeToRefs } from 'pinia';
import { useProfileStore, useGlobalDialogStore, useContentStore, useLiveStore } from '@lyvely/web';
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
  TClient extends ITimeSeriesCalendarPlanClient<
    TModel,
    TDataPoint,
    TResponse
  > = ITimeSeriesCalendarPlanClient<TModel, TDataPoint, TResponse>,
> extends ICalendarPlanOptions<TModel, TFilter, TResponse, TStore, TClient> {
  onDataPointUpdated?: (response: Awaited<ReturnType<TClient['updateDataPoint']>>) => void;
  type: string;
}

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
  TClient extends ITimeSeriesCalendarPlanClient<
    TModel,
    TDataPoint,
    TResponse
  > = ITimeSeriesCalendarPlanClient<TModel, TDataPoint, TResponse>,
>(
  options: ITimeSeriesCalendarPlanOptions<TModel, TFilter, TDataPoint, TResponse, TStore, TClient>
) {
  const profileStore = useProfileStore();
  const { locale } = storeToRefs(profileStore);
  const calendarPlanStore = useCalendarPlanStore();
  const calendarPlan = useCalendarPlan<TModel, TFilter, TResponse, TStore, TClient>(options);
  const dialog = useGlobalDialogStore();
  const live = useLiveStore();

  const { cache, client } = calendarPlan;

  live.on(
    'time-series',
    buildDataPointUpdateEventName(options.type),
    (event: DatapointUpdateLiveEvent) => {
      const dataPoint = cache.value.getDataPoint(event.cid, event.tid, false);
      if (!dataPoint || dataPoint.valueType !== event.valueType) return;
      // TODO: How to handle timer?
      dataPoint.value =
        event.valueType === DataPointValueType.Timer
          ? new TimerDataPointValueModel(event.value as PropertiesOf<TimerDataPointValueModel>)
          : event.value;
    }
  );

  function getDataPoint(model: TimeSeriesContentModel) {
    const timingId = toTimingId(
      calendarPlanStore.date,
      model.timeSeriesConfig.interval,
      locale.value,
      profileStore.getSetting('calendar')
    );
    return cache.value.getDataPoint(model, timingId, true);
  }

  async function updateDataPoint(
    dataPoint: DataPointModel,
    value: any,
    oldValue?: any,
    debounce = false
  ) {
    if (debounce) {
      await debounceUpdate(dataPoint, value, oldValue);
      return;
    }

    try {
      dataPoint.value = value;
      const result = await client.updateDataPoint(dataPoint.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value,
      });

      cache.value.setModel(result.model as TModel);
      useContentStore().emitPostContentUpdateEvent(result.model.type, result.model);
      cache.value.setDataPoint(result.dataPoint as TDataPoint);

      if (options.onDataPointUpdated)
        options.onDataPointUpdated(result as Awaited<ReturnType<TClient['updateDataPoint']>>);
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
    500
  );

  return {
    ...calendarPlan,
    getDataPoint,
    updateDataPoint,
  };
}
