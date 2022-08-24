import { defineStore } from 'pinia';
import {
  toTimingId,
  formatDate,
  IActivity,
  ITimeSeriesNumberDataPoint,
  CalendarIntervalEnum,
  IHabit,
  HabitDto,
  NumberDataPointDto
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profile/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import habitsRepository from '@/modules/activity/repositories/habits.repository';
import { MoveActivityEvent, useActivityStore } from "@/modules/activity/store/activityStore";

export const useHabitPlanStore = defineStore('habitPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();

  async function move(moveEvent: MoveActivityEvent) {
    await activityStore.move(
      moveEvent,
      getHabitsByCalendarInterval(moveEvent.fromInterval),
      getHabitsByCalendarInterval(moveEvent.toInterval),
    );
  }

  function getHabitsByCalendarInterval(interval: CalendarIntervalEnum) {
    return activityStore.cache.getHabitsByCalendarInterval(interval, activityStore.filter);
  }

  function addHabit(habit: IHabit) {
    activityStore.cache.addModel(new HabitDto(habit))
  }

  function addDataPoint(dataPoint: ITimeSeriesNumberDataPoint) {
    activityStore.cache.addDataPoint(new NumberDataPointDto(dataPoint))
  }

  function getDataPoint(activity: IActivity) {
    const timingId = toTimingId(calendarPlanStore.date, activity.dataPointConfig.interval);
    return activityStore.cache.getDataPoint(activity, timingId, true);
  }

  async function updateDataPoint(log: ITimeSeriesNumberDataPoint, value: number) {
    try {
      const { data } = await habitsRepository.updateDataPoint(log.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value
      });

      log.value = data.units;
      // TODO: (Integirty) assure setting score for the right profile
      profileStore.updateScore(data.score);
    } catch (e) {
      //TODO: (Error Handling) reset units + handle error
    }
  }

  return { addHabit, addDataPoint, move, getDataPoint, updateDataPoint, getHabitsByCalendarInterval};
});
