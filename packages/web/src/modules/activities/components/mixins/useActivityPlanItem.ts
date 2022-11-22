import { ActivityModel, ActivityType } from '@lyvely/common';
import { computed } from 'vue';
import { useCalendarPlanStore } from '@/modules/calendar/store';
import { useHabitPlanStore } from '@/modules/activities/store/habit-plan.store';
import { useTaskPlanStore } from '@/modules/activities/store/task-plan.store';
import { useAccessibilityStore } from '@/modules/accessibility';
import { translate } from '@/i18n';
import { IMoveActivityEvent } from '@/modules/activities/store/activity.store';

export const useActivityPlanItem = (model: ActivityModel) => {
  const calendarPlanStore = useCalendarPlanStore();
  const isFuture = computed(() => calendarPlanStore.date > new Date());
  const isDisabled = computed(() => model.meta.isArchived || isFuture.value);

  function prepareMoveEvent(model: ActivityModel, element: HTMLElement, newIndex: (current: number) => number) {
    const draggableElement = element.closest('[data-draggable]')!;
    const currentIndex = Array.from(draggableElement.parentNode!.children).indexOf(draggableElement);

    return {
      draggable: draggableElement,
      store: model.type === ActivityType.Habit ? useHabitPlanStore() : useTaskPlanStore(),
      event: {
        cid: model.id,
        fromInterval: model.dataPointConfig.interval,
        toInterval: model.dataPointConfig.interval,
        oldIndex: currentIndex,
        newIndex: newIndex(currentIndex),
      },
    };
  }

  async function moveUp(model: ActivityModel, element: HTMLElement) {
    const { store, event } = prepareMoveEvent(model, element, (currentIndex) => currentIndex - 1);

    if (event.oldIndex === 0) {
      useAccessibilityStore().addMessage(translate('calendar.plan.aria.move-boundary'));
      return;
    }

    await store.move(event);
    afterMove(event);
  }

  async function moveDown(model: ActivityModel, element: HTMLElement) {
    const { store, event, draggable } = prepareMoveEvent(model, element, (currentIndex) => currentIndex + 1);

    if (draggable.parentNode!.children.length === event.newIndex) {
      useAccessibilityStore().addMessage(translate('calendar.plan.aria.move-boundary'));
      return;
    }

    await store.move(event);
    afterMove(event);
  }

  function afterMove(evt: IMoveActivityEvent) {
    setTimeout(() => document.querySelector<HTMLElement>(`[data-cid="${evt.cid}"] .item-drag-button`)?.focus());
    useAccessibilityStore().addMessage(
      translate('calendar.plan.aria.move-success', {
        from: evt.oldIndex,
        to: evt.newIndex,
      }),
    );
  }

  return {
    isFuture,
    isDisabled,
    moveUp,
    moveDown,
  };
};
