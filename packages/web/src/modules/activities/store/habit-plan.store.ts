import { defineStore } from 'pinia';
import {
  toTimingId,
  formatDate,
  NumberDataPointModel,
  CalendarIntervalEnum,
  HabitModel,
  ActivityType,
  TimerUpdate,
} from '@lyvely/common';
import { useProfileStore } from '@/modules/profiles/stores/profile.store';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import habitsRepository from '@/modules/activities/repositories/habits.repository';
import { IMoveActivityEvent, useActivityStore } from '@/modules/activities/store/activity.store';
import { useHabitsService } from '@/modules/activities/services/habits.service';

export const useHabitPlanStore = defineStore('habitPlan', () => {
  const activityStore = useActivityStore();
  const calendarPlanStore = useCalendarPlanStore();
  const profileStore = useProfileStore();
  const habitsService = useHabitsService();

  async function move(moveEvent: IMoveActivityEvent) {
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
    activityStore.cache.setModel(new HabitModel(habit));
  }

  function addDataPoint(dataPoint: NumberDataPointModel) {
    activityStore.cache.setDataPoint(new NumberDataPointModel(dataPoint));
  }

  function getDataPoint(activity: HabitModel) {
    const timingId = toTimingId(calendarPlanStore.date, activity.dataPointConfig.interval);
    return activityStore.cache.getDataPoint(activity, timingId, true);
  }

  async function updateDataPoint(log: NumberDataPointModel, value: number) {
    const oldValue = log.value;

    try {
      log.value = value;
      const { data } = await habitsRepository.updateDataPoint(log.cid, {
        date: formatDate(calendarPlanStore.date),
        value: value,
      });

      log.value = data.units;
      profileStore.updateScore(data.score);
    } catch (e) {
      log.value = oldValue;
      //TODO: (Error Handling) reset units + handle error
    }
  }

  async function startTimer(activity: HabitModel) {
    const updatedDataPoint = await habitsService.startTimer(activity.id, new TimerUpdate(calendarPlanStore.date));
    activityStore.cache.setDataPoint(updatedDataPoint);
  }

  async function stopTimer(activity: HabitModel) {
    const updatedDataPoint = await habitsService.stopTimer(activity.id, new TimerUpdate(calendarPlanStore.date));
    activityStore.cache.setDataPoint(updatedDataPoint);
  }

  return { addHabit, addDataPoint, move, getDataPoint, updateDataPoint, startTimer, stopTimer };
});
