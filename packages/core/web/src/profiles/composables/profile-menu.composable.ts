import { getMenuEntries, type IMenuEntry } from '@lyvely/ui';
import { computed, type ComputedRef, type Ref, unref } from 'vue';
import { sortBySortOrder } from '@lyvely/interface';
import { useProfileFeatureStore } from '@/profiles/stores/profile-feature.store';
import { isNil } from '@lyvely/common';

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

export const useProfileMenu = <TContext = any>(menuId: string, context?: TContext) => {
  const allMenuEntries = computed(() => getMenuEntries<TContext>(menuId, context));
  const enabledMenuEntries = computed(() => {
    return allMenuEntries.value
      .filter((entry: IMenuEntry) => {
        return (
          (isNil(entry.feature) || useProfileFeatureStore().isFeaturesEnabled(entry.feature)) &&
          resolveCondition(entry.condition, context)
        );
      })
      .sort(sortBySortOrder);
  });

  const hasEnabledEntries = computed(() => !!enabledMenuEntries.value.length);

  return {
    enabledMenuEntries,
    allMenuEntries,
    hasEnabledEntries,
  };
};
