import { defineStore } from 'pinia';
import {
  toTimingId,
  formatDate,
  ActivityModel,
  NumberDataPointModel,
  CalendarIntervalEnum,
  HabitModel,
  ActivityType } from '@lyvely/common';
import { useProfileStore } from '@server/modules/profile/stores/profile.store';
import { useCalendarPlanStore } from '@server/modules/calendar/store';
import habitsRepository from '@server/modules/activity/repositories/habits.repository';
import { MoveActivityEvent, useActivityStore } from "@server/modules/activity/store/activityStore";

export const useHabitPlanStore = defineStore('habitPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();

  async function move(moveEvent: MoveActivityEvent) {
    await activityStore.move(
      moveEvent,
      _getHabitsByCalendarInterval(moveEvent.fromInterval),
      _getHabitsByCalendarInterval(moveEvent.toInterval),
    );
  }

  function _getHabitsByCalendarInterval(interval: CalendarIntervalEnum) {
    return activityStore.getActivities(ActivityType.Habit, interval);
  }

  function addHabit(habit: HabitModel) {
    activityStore.cache.addModel(new HabitModel(habit))
  }

  function addDataPoint(dataPoint: NumberDataPointModel) {
    activityStore.cache.addDataPoint(new NumberDataPointModel(dataPoint))
  }

  function getDataPoint(activity: ActivityModel) {
    const timingId = toTimingId(calendarPlanStore.date, activity.dataPointConfig.interval);
    return activityStore.cache.getDataPoint(activity, timingId, true);
  }

  async function updateDataPoint(log: NumberDataPointModel, value: number) {
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

  return { addHabit, addDataPoint, move, getDataPoint, updateDataPoint };
});
