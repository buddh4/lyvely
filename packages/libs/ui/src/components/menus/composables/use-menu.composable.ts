import { getMenuEntries } from '../registries';
import { computed, ComputedRef, Ref, unref } from 'vue';
import { sortBySortOrder } from '@/helpers';
import { isNil } from '@lyvely/common';
import type { IMenuEntry } from '../interfaces';

function resolveCondition<TContext>(
  condition:
    | undefined
    | null
    | boolean
    | Ref<boolean>
    | ComputedRef<boolean>
    | ((context: TContext) => Ref<boolean> | ComputedRef<boolean> | boolean),
  context: TContext
): boolean {
  // If the value is a function, call it with the context
  if (isNil(condition)) return true;

  if (typeof condition === 'function') {
    condition = condition(context);
  }

  // If the value is a ref or computed ref, unref it to get the actual value
  return unref(condition);
}

export const useMenu = <TContext = any>(menuId: string, context?: TContext) => {
  const allMenuEntries = computed(() => getMenuEntries<TContext>(menuId, context));

  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry: IMenuEntry) => resolveCondition(entry.condition, context))
      .sort(sortBySortOrder);
  });

  const hasEnabledEntries = computed(() => !!enabledMenuEntries.value.length);

  return {
    allMenuEntries,
    enabledMenuEntries,
    hasEnabledEntries,
  };
};
