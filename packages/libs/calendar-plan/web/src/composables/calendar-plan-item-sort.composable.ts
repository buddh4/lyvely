import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { IMoveEntryEvent } from '@/interfaces';
import { useAccessibilityStore, translate, IDragEvent } from '@lyvely/web';

export interface ISortableStore {
  sort(evt: IDragEvent | IMoveEntryEvent): Promise<void>;
}

export function useCalendarPlanItemSort<TModel extends ICalendarPlanEntry>(
  model: TModel,
  store: ISortableStore
) {
  function prepareMoveEvent(
    model: TModel,
    element: HTMLElement,
    newIndex: (current: number) => number
  ) {
    const draggableElement = element.closest('[data-draggable]')!;
    const currentIndex = Array.from(draggableElement.parentNode!.children).indexOf(
      draggableElement
    );

    return {
      draggable: draggableElement,
      event: {
        cid: model.id,
        fromInterval: model.interval,
        toInterval: model.interval,
        oldIndex: currentIndex,
        newIndex: newIndex(currentIndex),
      } as IMoveEntryEvent,
    };
  }

  function getElement(): HTMLElement | null {
    return document.querySelector(`.calendar-plan-item[data-cid=${model.id}]`);
  }

  async function moveUp() {
    const element = getElement();

    if (!element)
      throw new Error(`Can not move up non existing element for calendar plan item ${model.id}`);

    const { event } = prepareMoveEvent(model, element, (currentIndex) => currentIndex - 1);

    if (event.oldIndex === 0) {
      useAccessibilityStore().addMessage(translate('calendar-plan.aria.move-boundary'));
      return;
    }

    await store.sort(event);
    afterSort(event);
  }

  async function moveDown() {
    const element = getElement();

    if (!element)
      throw new Error(`Can not move up non existing element for calendar plan item ${model.id}`);

    const { event, draggable } = prepareMoveEvent(
      model,
      element,
      (currentIndex) => currentIndex + 1
    );

    if (draggable.parentNode!.children.length === event.newIndex) {
      useAccessibilityStore().addMessage(translate('calendar-plan.aria.move-boundary'));
      return;
    }

    await store.sort(event);
    afterSort(event);
  }

  function afterSort(evt: IMoveEntryEvent) {
    setTimeout(() =>
      document.querySelector<HTMLElement>(`[data-cid="${evt.cid}"] .item-drag-button`)?.focus()
    );
    useAccessibilityStore().addMessage(
      translate('calendar-plan.aria.move-success', {
        from: `${evt.oldIndex}`,
        to: `${evt.newIndex}`,
      })
    );
  }

  return {
    moveUp,
    moveDown,
  };
}
