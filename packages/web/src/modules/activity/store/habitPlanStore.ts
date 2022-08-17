import { defineStore } from 'pinia';
import {
  toTimingId,
  formatDate,
  IActivity,
  ITimeSeriesNumberDataPoint,
  CalendarIntervalEnum,
  getCalendarPlanOptions,
  IHabit,
  HabitDto,
  NumberDataPointDto
} from '@lyvely/common';
import { useProfileStore } from '@/modules/user/store/profile.store';
import { useTimingStore } from '@/modules/timing/store';
import habitsRepository from '@/modules/activity/repositories/habits.repository';
import { MoveActivityEvent, useActivityStore } from "@/modules/activity/store/activityStore";
import { computed, ComputedRef } from 'vue';
import activityRepository from "@/modules/activity/repositories/activity.repository";

export const useHabitPlanStore = defineStore('habitPlan', () => {
  const activityStore = useActivityStore();
  const timingStore = useTimingStore();
  const profileStore = useProfileStore();

  const habitsByInterval: { [key in CalendarIntervalEnum]?: ComputedRef<IHabit[]>} = {};
  getCalendarPlanOptions().forEach((option: { value: CalendarIntervalEnum }) => {
    habitsByInterval[option.value] = computed(() => activityStore.cache.getHabitsByCalendarInterval(option.value, activityStore.filter))
  });

  async function move(moveEvent: MoveActivityEvent) {
    const activity = activityStore.cache.getModel(moveEvent.cid);
    let attachTo = undefined as IActivity|undefined;
    const toHabitList = habitsByInterval[moveEvent.toInterval];
    const fromHabitList = habitsByInterval[moveEvent.fromInterval];

    if(!fromHabitList || !toHabitList) {
      console.assert(!!fromHabitList && !!toHabitList, 'Unknown interval set on move event');
      return;
    }

    if(moveEvent.newIndex > 0) {
      if(!toHabitList) return;
      attachTo = toHabitList.value[moveEvent.newIndex - 1];
    }

    if(moveEvent.fromInterval !== moveEvent.toInterval) {
      activity.dataPointConfig.interval = moveEvent.toInterval;
    }

    const { data } = await activityRepository.sort(activity.id, moveEvent.toInterval, attachTo?.id);

    data.forEach(update => {
      const entry = activityStore.cache.getModel(update.id);
      if(entry) {
        entry.sortOrder = update.sortOrder;
      }
    });
  };

  function getHabitsByCalendarInterval(interval: CalendarIntervalEnum) {
    return habitsByInterval[interval];
  }

  function addHabit(habit: IHabit) {
    activityStore.cache.addModel(new HabitDto(habit))
  }

  function addDataPoint(dataPoint: ITimeSeriesNumberDataPoint) {
    activityStore.cache.addDataPoint(new NumberDataPointDto(dataPoint))
  }

  function getDataPoint(activity: IActivity) {
    const timingId = toTimingId(timingStore.date, activity.dataPointConfig.interval);
    return activityStore.cache.getDataPoint(activity, timingId, true);
  }

  async function updateDataPoint(log: ITimeSeriesNumberDataPoint, value: number) {
    try {
      const { data } = await habitsRepository.updateDataPoint(log.cid, {
        date: formatDate(timingStore.date),
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
