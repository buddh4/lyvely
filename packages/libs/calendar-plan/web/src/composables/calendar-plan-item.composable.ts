import { ICalendarPlanEntry } from '@lyvely/calendar-plan-interface';
import { computed, nextTick } from 'vue';
import { useCalendarPlanStore } from '@/stores';
import { storeToRefs } from 'pinia';

export function useCalendarPlanItem<TModel extends ICalendarPlanEntry>(model: TModel) {
  const { isInFuture } = storeToRefs(useCalendarPlanStore());

  const isDisabled = computed(
    () => !model.policies.canWrite || model.meta.archived || isInFuture.value
  );

  function getElement(): HTMLElement | null {
    return document.querySelector(`.calendar-plan-item[data-cid="${model.id}"]`);
  }

  function scrollInView() {
    getElement()?.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
  }

  function highlight(duration = 1700) {
    return new Promise((resolve, reject) => {
      nextTick(() => {
        const element = getElement();
        if (!element) {
          reject();
          return;
        }

        element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
        element.classList.add('ui-bg-shimmer');
        setTimeout(() => {
          element.classList.remove('ui-bg-shimmer');
          resolve(element);
        }, duration);
      });
    });
  }

  return {
    highlight,
    scrollInView,
    isInFuture,
    isDisabled,
  };
}
