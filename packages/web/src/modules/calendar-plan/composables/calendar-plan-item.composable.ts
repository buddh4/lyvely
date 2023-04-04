import { TimeSeriesContentModel } from '@lyvely/common';
import { computed } from 'vue';
import { IMoveEntryEvent, useCalendarPlanStore } from '@/modules/calendar-plan';
import { useAccessibilityStore } from '@/modules/accessibility';
import { translate } from '@/i18n';
import { IMoveActivityEvent } from '@/modules/activities/store/activity.store';
import { IDragEvent } from '@/modules/common';

export interface ISortableStore {
  sort(evt: IDragEvent | IMoveEntryEvent): Promise<void>;
}

export function useCalendarPlanPlanItem<TModel extends TimeSeriesContentModel>(
  model: TModel,
  store: ISortableStore,
) {
  const calendarPlanStore = useCalendarPlanStore();
  const isFuture = computed(() => calendarPlanStore.date > new Date());
  const isDisabled = computed(() => model.meta.isArchived || isFuture.value);

  function prepareMoveEvent(
    model: TModel,
    element: HTMLElement,
    newIndex: (current: number) => number,
  ) {
    const draggableElement = element.closest('[data-draggable]')!;
    const currentIndex = Array.from(draggableElement.parentNode!.children).indexOf(
      draggableElement,
    );

    return {
      draggable: draggableElement,
      event: {
        cid: model.id,
        fromInterval: model.timeSeriesConfig.interval,
        toInterval: model.timeSeriesConfig.interval,
        oldIndex: currentIndex,
        newIndex: newIndex(currentIndex),
      } as IMoveEntryEvent,
    };
  }

  async function moveUp(model: TModel, element: HTMLElement) {
    const { event } = prepareMoveEvent(model, element, (currentIndex) => currentIndex - 1);

    if (event.oldIndex === 0) {
      useAccessibilityStore().addMessage(translate('calendar.plan.aria.move-boundary'));
      return;
    }

    await store.sort(event);
    afterSort(event);
  }

  async function moveDown(model: TModel, element: HTMLElement) {
    const { event, draggable } = prepareMoveEvent(
      model,
      element,
      (currentIndex) => currentIndex + 1,
    );

    if (draggable.parentNode!.children.length === event.newIndex) {
      useAccessibilityStore().addMessage(translate('calendar.plan.aria.move-boundary'));
      return;
    }

    await store.sort(event);
    afterSort(event);
  }

  function afterSort(evt: IMoveActivityEvent) {
    setTimeout(() =>
      document.querySelector<HTMLElement>(`[data-cid="${evt.cid}"] .item-drag-button`)?.focus(),
    );
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
}
