import { ActivityType, CalendarIntervalEnum } from 'lyvely-common';
import { useActivityStore } from '@/modules/activity/store/activityStore';
import { computed } from 'vue';

export function useActivityList(plan: CalendarIntervalEnum, type: ActivityType) {
  const activityStore = useActivityStore();

  const activities = (type === ActivityType.Habit)
    ? computed(() => activityStore.habits(plan))
    : computed(() => activityStore.tasks(plan));

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
