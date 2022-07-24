import { ActivityType, CalendarIntervalEnum } from 'lyvely-common';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { computed } from 'vue';

export function useActivityList(interval: CalendarIntervalEnum, type: ActivityType) {
  const activityStore = useActivityStore();

  const activities = (type === ActivityType.Habit)
    ? computed(() => activityStore.habits(interval))
    : computed(() => activityStore.tasks(interval));

  const activityCount = computed(() => activities.value.length);

  function dragEnd(evt: any) {
    activityStore.move( {
      id: evt.item.dataset.activityId,
      newIndex: evt.newIndex,
      oldIndex: evt.oldIndex
    });
  }

  function onDateChanged() {
    activityStore.loadActivities();
  }



  return { activities, activityCount, dragEnd, onDateChanged };
}
